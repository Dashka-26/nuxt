<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <div class="flex justify-start mb-6">
      <UButton
        to="/categories"
        variant="ghost"
        color="neutral"
        icon="i-heroicons-arrow-left"
      >
        Назад до списку
      </UButton>
    </div>

    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Редагування категорії
        </h1>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit"
        @error="onError"
      >
        <div class="flex flex-col gap-6 w-full">
          <UFormField
            label="Назва категорії"
            name="title"
            required
          >
            <UInput
              v-model="state.title"
              size="lg"
              placeholder="Введіть назву категорії"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Slug (необов'язково)"
            name="slug"
            class="w-full"
          >
            <UInput
              v-model="state.slug"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Опис категорії"
            name="description"
            class="w-full"
          >
            <UTextarea
              v-model="state.description"
              size="lg"
              :rows="4"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Батьківська категорія" name="parent_id" required class="w-full">
            <div class="relative w-full">
              <select
                v-model="state.parent_id"
                class="relative block w-full focus:outline-none border-0 rounded-md text-base px-3.5 py-2.5 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer appearance-none"
              >
                <option
                  v-for="cat in categories"
                  :key="cat.id"
                  :value="cat.id"
                >
                  {{ cat.id_title }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <UIcon
                  name="i-heroicons-chevron-down-20-solid"
                  class="w-5 h-5"
                />
              </div>
            </div>
          </UFormField>

          <div class="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <UButton
              type="submit"
              color="primary"
              size="lg"
              :loading="isSubmitting"
            >
              Зберегти зміни
            </UButton>
          </div>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { z } from 'zod'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const toast = useToast() // Підключаємо красиві сповіщення Nuxt UI
const categoryId = route.params.id
const isSubmitting = ref(false)
const categories = ref<{ id: number, id_title: string }[]>([])

const schema = z.object({
  title: z.string()
    .min(1, 'Це поле пусте, а воно обов\'язкове')
    .min(5, 'Мінімум 5 символів')
    .max(200, 'Максимум 200 символів'),
  slug: z.string()
    .max(200, 'Максимум 200 символів')
    .optional(),
  description: z.string()
    .max(500, 'Максимум 500 символів')
    .optional(),
  parent_id: z.coerce.number()
    .int('Має бути цілим числом')
    .min(1, 'Оберіть батьківську категорію')
})

const state = reactive({
  title: '',
  slug: '',
  description: '',
  parent_id: undefined as number | undefined
})

onMounted(async () => {
  try {
    const [categoriesRes, categoryRes] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      $fetch<any>('http://localhost/api/admin/blog/categories?per_page=100'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      $fetch<any>(`http://localhost/api/admin/blog/categories/${categoryId}`)
    ])

    const rawCategories = categoriesRes.data || categoriesRes || []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories.value = rawCategories.map((cat: any) => ({
      id: cat.id,
      id_title: `${cat.id}. ${cat.title}`
    }))

    const categoryData = categoryRes.data || categoryRes
    state.title = categoryData.title || ''
    state.slug = categoryData.slug || ''
    state.description = categoryData.description || ''
    state.parent_id = categoryData.parent_id || 1
  } catch (error) {
    console.error('Помилка завантаження даних:', error)
  }
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit = async (event: any) => {
  isSubmitting.value = true
  try {
    await $fetch(`http://localhost/api/admin/blog/categories/${categoryId}`, {
      method: 'PATCH',
      body: event.data
    })

    // Виводимо красиве віконце про успіх оновлення
    toast.add({
      title: 'Зміни збережено!',
      description: 'Дані категорії успішно оновлено в базі даних.',
      color: 'success'
    })

    router.push('/categories')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error)
    const backendMessage = error.response?._data?.message || 'Помилка збереження на сервері.'

    // Виводимо красиве віконце про помилку
    toast.add({
      title: 'Помилка оновлення',
      description: backendMessage,
      color: 'warning'
    })
  } finally {
    isSubmitting.value = false
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onError = (_event: any) => {
  toast.add({
    title: 'Помилка валідації',
    description: 'Перевірте правильність заповнення полів (вони підсвічені червоним).',
    color: 'error'
  })
}
</script>
