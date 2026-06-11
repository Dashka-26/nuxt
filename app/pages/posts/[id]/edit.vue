<template>
  <div class="container mx-auto p-6 max-w-2xl">
    <UButton
      to="/BlogPostsUi"
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
          Редагування статті
        </h1>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        class="flex flex-col gap-6"
        @submit="onSubmit"
        @error="onError"
      >
        <UFormGroup
          label="Заголовок статті"
          name="title"
        >
          <UInput
            v-model="state.title"
            placeholder="Введіть заголовок"
          />
        </UFormGroup>

        <UFormGroup
          label="Slug"
          name="slug"
        >
          <UInput
            v-model="state.slug"
            placeholder="my-post"
          />
        </UFormGroup>

        <UFormGroup
          label="Короткий опис"
          name="excerpt"
        >
          <UTextarea
            v-model="state.excerpt"
            placeholder="Введіть короткий опис"
            :rows="2"
          />
        </UFormGroup>

        <UFormGroup
          label="Текст статті"
          name="content_raw"
        >
          <UTextarea
            v-model="state.content_raw"
            placeholder="Введіть текст статті"
            :rows="6"
          />
        </UFormGroup>

        <UFormGroup
          label="ID Категорії"
          name="category_id"
        >
          <UInput
            v-model="state.category_id"
            type="number"
            placeholder="ID категорії"
          />
        </UFormGroup>

        <div class="flex justify-end pt-4">
          <UButton
            type="submit"
            color="primary"
            :loading="isSubmitting"
          >
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
const postId = route.params.id
const isSubmitting = ref(false)

const schema = z.object({
  title: z.string().min(5).max(200),
  slug: z.string().max(200).optional(),
  excerpt: z.string().max(500).optional(),
  content_raw: z.string().min(5).max(10000),
  category_id: z.coerce.number().int().positive()
})

const state = reactive({
  title: undefined as string | undefined,
  slug: undefined as string | undefined,
  excerpt: undefined as string | undefined,
  content_raw: undefined as string | undefined,
  category_id: undefined as number | undefined
})

interface PostResponse {
  data?: {
    title?: string
    slug?: string
    excerpt?: string
    content_raw?: string
    category_id?: number
  }
  title?: string
  slug?: string
  excerpt?: string
  content_raw?: string
  category_id?: number
}

const fetchPost = async () => {
  try {
    const response = await $fetch<PostResponse>(`http://localhost/api/admin/blog/posts/${postId}`)
    const postData = response.data || response
    state.title = postData.title || undefined
    state.slug = postData.slug || undefined
    state.excerpt = postData.excerpt || undefined
    state.content_raw = postData.content_raw || undefined
    state.category_id = postData.category_id || undefined
  } catch (error) {
    console.error(error)
  }
}

const onError = (error: unknown) => {
  console.log(error)
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit = async (event: any) => {
  isSubmitting.value = true
  try {
    await $fetch(`http://localhost/api/admin/blog/posts/${postId}`, {
      method: 'PATCH',
      body: event.data
    })
    router.push('/BlogPostsUi')
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

fetchPost()
</script>
