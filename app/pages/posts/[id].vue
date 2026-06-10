<template>
  <div class="container mx-auto p-6 max-w-3xl">
    <UButton
      to="/BlogPostsUi"
      variant="ghost"
      icon="i-heroicons-arrow-left"
      class="mb-6"
    >
      Назад до списку
    </UButton>

    <div v-if="pending" class="flex justify-center py-12">
      <UIcon
        name="i-heroicons-arrow-path"
        class="animate-spin text-4xl text-primary-500"
      />
    </div>

    <div v-else-if="error">
      <UAlert
        color="error"
        title="Помилку отримано"
        :description="'Не вдалося завантажити пост. ' + error.message"
      />
    </div>

    <UCard v-else-if="post">
      <template #header>
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <UBadge
              v-if="post.category"
              color="primary"
              variant="soft"
            >
              {{ post.category.title }}
            </UBadge>
            <span>•</span>
            <span>{{ post.user?.name || 'Невідомо' }}</span>
            <span>•</span>
            <span>{{ formattedDate }}</span>
          </div>
          <h1 class="text-3xl font-bold">
            {{ post.title }}
          </h1>
        </div>
      </template>

      <div class="prose max-w-none">
        <p class="whitespace-pre-line text-gray-700">
          {{ post.content_raw }}
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
interface Post {
  id: number
  title: string
  content_raw: string
  published_at: string | null
  category: { title: string } | null
  user: { name: string } | null
}

const route = useRoute()
const id = route.params.id

const { data: post, pending, error } = await useFetch<Post>(
  `http://localhost/api/blog/posts/${id}`
)

const formattedDate = computed(() => {
  if (!post.value?.published_at) return 'Не опубліковано'
  return new Date(post.value.published_at).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>
