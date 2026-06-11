<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">
        Керування статтями
      </h1>
      <UButton
        to="/posts/create"
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
            :to="'/posts/' + row.original.id"
            class="text-primary-500 hover:underline"
          >
            {{ row.original.title }}
          </ULink>
        </template>

        <template #user-cell="{ row }">
          {{ row.original.author_name || 'Невідомо' }}
        </template>

        <template #category-cell="{ row }">
          {{ row.original.category_title || 'Без категорії' }}
        </template>

        <template #actions-cell="{ row }">
          <UDropdownMenu :items="getActionItems(row.original)">
            <UButton color="neutral" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdownMenu>
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
  date_published: string | null
  category_title: string | null
  author_name: string | null
}

interface ApiResponse {
  data: Post[]
  total: number
  meta?: {
    total: number
  }
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
  { accessorKey: 'date_published', header: 'Дата публікації' },
  { id: 'actions', header: 'Дії' }
]

const getActionItems = (row: Post) => [
  [
    {
      label: 'Переглянути',
      icon: 'i-heroicons-eye-20-solid',
      to: `/posts/${row.id}`
    },
    {
      label: 'Редагувати',
      icon: 'i-heroicons-pencil-square-20-solid',
      to: `/posts/${row.id}/edit`
    }
  ],
  [
    {
      label: 'Видалити',
      icon: 'i-heroicons-trash-20-solid',
      onSelect: () => deletePost(row.id)
    }
  ]
]

const fetchPosts = async () => {
  pending.value = true
  try {
    const response = await $fetch<ApiResponse>(`http://localhost/api/admin/blog/posts?page=${page.value}`)
    posts.value = response.data
    totalPosts.value = response.meta?.total || response.total || 0
  } catch (error) {
    console.error(error)
  } finally {
    pending.value = false
  }
}

const deletePost = async (id: number) => {
  if (!confirm('Ви дійсно хочете видалити цю статтю?')) return
  try {
    await $fetch(`http://localhost/api/admin/blog/posts/${id}`, { method: 'DELETE' })
    fetchPosts()
  } catch (error) {
    console.error(error)
  }
}

fetchPosts()

watch(page, () => {
  fetchPosts()
})
</script>
