<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <div class="flex justify-start mb-6">
      <UButton
        to="/BlogPostsUi"
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
          Створення статті
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
            label="Заголовок статті"
            name="title"
            required
          >
            <UInput
              v-model="state.title"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Slug"
            name="slug"
            class="w-full"
          >
            <UInput
              v-model="state.slug"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Категорія статті" name="category_id" required class="w-full">
            <div class="relative w-full">
              <select
                v-model="state.category_id"
                class="relative block w-full focus:outline-none border-0 rounded-md text-base px-3.5 py-2.5 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer appearance-none"
              >
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.id_title }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <UIcon name="i-heroicons-chevron-down-20-solid" class="w-5 h-5" />
              </div>
            </div>
          </UFormField>

          <UFormField
            label="Короткий опис"
            name="excerpt"
            class="w-full"
          >
            <UTextarea
              v-model="state.excerpt"
              size="lg"
              :rows="3"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Текст статті"
            name="content_raw"
            required
            class="w-full"
          >
            <UTextarea
              v-model="state.content_raw"
              size="lg"
              :rows="8"
              class="w-full"
            />
          </UFormField>

          <div class="flex gap-6 w-full">
            <UFormField
              label="Статус публікації"
              name="is_published"
              class="w-1/2"
            >
              <UCheckbox
                v-model="state.is_published"
                label="Опублікувати статтю"
              />
            </UFormField>
          </div>

          <div class="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <UButton
              type="submit"
              color="primary"
              size="lg"
              :loading="isSubmitting"
            >
              Зберегти статтю
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
import { useRouter } from 'vue-router'

const router = useRouter()
const toast = useToast()
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
  category_id: z.coerce.number()
    .int('Має бути цілим числом')
    .min(1, 'Оберіть категорію'),
  excerpt: z.string()
    .max(500, 'Максимум 500 символів')
    .optional(),
  content_raw: z.string()
    .min(1, 'Це поле пусте, а воно обов\'язкове')
    .min(5, 'Мінімум 5 символів')
    .max(10000, 'Максимум 10000 символів'),
  is_published: z.boolean().optional()
})

const state = reactive({
  title: '',
  slug: '',
  category_id: undefined as number | undefined,
  excerpt: '',
  content_raw: '',
  is_published: false
})

onMounted(async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await $fetch<any>('http://localhost/api/admin/blog/categories?per_page=100')
    const rawCategories = response.data || response || []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories.value = rawCategories.map((cat: any) => ({
      id: cat.id,
      id_title: `${cat.id}. ${cat.title}`
    }))
  } catch (error) {
    console.error('Помилка завантаження списку категорій:', error)
  }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit = async (event: any) => {
  isSubmitting.value = true
  try {
    await $fetch('http://localhost/api/admin/blog/posts', {
      method: 'POST',
      body: event.data
    })
    toast.add({
      title: 'Успішно створено!',
      description: 'Нову статтю успішно додано до системи.',
      color: 'success'
    })
    router.push('/BlogPostsUi')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error)
    const backendMessage = error.response?._data?.message || 'Помилка збереження на сервері.'
    toast.add({
      title: 'Помилка збереження',
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
