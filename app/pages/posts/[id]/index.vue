<template>
  <div class="container mx-auto p-6 max-w-3xl">
    <UButton
      to="/BlogPostsUi"
      variant="ghost"
      color="neutral"
      icon="i-heroicons-arrow-left"
      class="mb-6"
    >
      Назад до списку
    </UButton>

    <UCard v-if="post">
      <template #header>
        <h1 class="text-3xl font-bold mb-2">
          {{ post.title }}
        </h1>
        <div class="flex gap-4 text-sm text-gray-500">
          <span v-if="post.date_published">Опубліковано: {{ post.date_published }}</span>
          <span v-if="post.author_name">Автор: {{ post.author_name }}</span>
        </div>
      </template>

      <div class="prose max-w-none">
        <p
          v-if="post.excerpt"
          class="italic text-gray-700 mb-6 border-l-4 border-gray-300 pl-4"
        >
          {{ post.excerpt }}
        </p>
        <div class="whitespace-pre-wrap leading-relaxed">
          {{ post.content_raw }}
        </div>
      </div>
    </UCard>

    <div
      v-else
      class="text-center py-10 text-gray-500"
    >
      Завантаження статті...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const postId = route.params.id
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const post = ref<any>(null)

const fetchPost = async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await $fetch<any>(`http://localhost/api/admin/blog/posts/${postId}`)
    post.value = response.data || response
  } catch (error) {
    console.error(error)
  }
}

fetchPost()
</script>
