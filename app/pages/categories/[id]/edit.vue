<template>
  <div class="container mx-auto p-6 max-w-2xl">
    <UButton
      to="/categories"
      variant="ghost"
      color="neutral"
      icon="i-heroicons-arrow-left"
      class="mb-6"
    >
      Назад до списку
    </UButton>

    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold">
          Редагування категорії
        </h1>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        class="flex flex-col gap-6"
        @submit="onSubmit"
      >
        <UFormGroup label="Назва категорії" name="title">
          <UInput v-model="state.title" placeholder="Введіть назву" />
        </UFormGroup>

        <UFormGroup label="Slug (необов'язково)" name="slug">
          <UInput v-model="state.slug" placeholder="my-category" />
        </UFormGroup>

        <UFormGroup label="ID Батьківської категорії" name="parent_id">
          <UInput v-model="state.parent_id" type="number" placeholder="id (1 для кореня)" />
        </UFormGroup>

        <div class="flex justify-end pt-4">
          <UButton type="submit" color="primary" :loading="isSubmitting">
            Зберегти зміни
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { z } from 'zod'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const categoryId = route.params.id
const isSubmitting = ref(false)

const schema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().max(200).optional(),
  parent_id: z.coerce.number().int().positive()
})

const state = reactive({
  title: undefined as string | undefined,
  slug: undefined as string | undefined,
  parent_id: undefined as number | undefined
})

const fetchCategory = async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await $fetch<any>(`http://localhost/api/admin/blog/categories/${categoryId}`)
    const categoryData = response.data || response
    state.title = categoryData.title || undefined
    state.slug = categoryData.slug || undefined
    state.parent_id = categoryData.parent_id || undefined
  } catch (error) {
    console.error(error)
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit = async (event: any) => {
  isSubmitting.value = true
  try {
    await $fetch(`http://localhost/api/admin/blog/categories/${categoryId}`, {
      method: 'PATCH',
      body: event.data
    })
    router.push('/categories')
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

fetchCategory()
</script>
