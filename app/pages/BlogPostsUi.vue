<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">
        Керування статтями (Nuxt UI v3)
      </h1>
      <UButton
        to="/admin/blog/posts/create"
        color="primary"
      >
        Додати статтю
      </UButton>
    </div>

    <UCard>
      <UTable
        :data="posts"
        :columns="columns"
        :loading="pending"
      >
        <template #title-cell="{ row }">
          <ULink
            :to="'/admin/blog/posts/' + (row.original as unknown as Post).id + '/edit'"
            class="text-primary-500 hover:underline"
          >
            {{ (row.original as unknown as Post).title }}
          </ULink>
        </template>
        <template #user-cell="{ row }">
          {{ (row.original as unknown as Post).user?.name || 'Невідомо' }}
        </template>
        <template #category-cell="{ row }">
          {{ (row.original as unknown as Post).category?.title || 'Без категорії' }}
        </template>
      </UTable>

      <div class="flex justify-end mt-4">
        <UPagination
          v-model:page="page"
          :items-per-page="perPage"
          :total="totalPosts"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Post {
  id: number
  title: string
  published_at: string | null
  category: { title: string } | null
  user: { name: string } | null
}

interface ApiResponse {
  data: Post[]
  total: number
}

const page = ref(1)
const posts = ref<Post[]>([])
const totalPosts = ref(0)
const perPage = ref(25)
const pending = ref(false)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: any[] = [
  { accessorKey: 'id', header: '#' },
  { accessorKey: 'user', header: 'Автор' },
  { accessorKey: 'category', header: 'Категорія' },
  { accessorKey: 'title', header: 'Заголовок' },
  { accessorKey: 'published_at', header: 'Дата публікації' }
]

const fetchPosts = async () => {
  pending.value = true
  try {
    const response = await $fetch<ApiResponse>(`http://localhost/api/admin/blog/posts?page=${page.value}`)
    posts.value = response.data
    totalPosts.value = response.total
  } catch (error) {
    console.error('Помилка API:', error)
  } finally {
    pending.value = false
  }
}

fetchPosts()

watch(page, () => {
  fetchPosts()
})
</script>
