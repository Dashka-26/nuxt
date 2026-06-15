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
      <div class="mb-4 flex justify-start">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Пошук за заголовком..."
          class="w-full max-w-sm"
        />
      </div>

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
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdownMenu>
        </template>
      </UTable>

      <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
        <div class="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <span>Show</span>
          <div class="relative">
            <select
              v-model="perPage"
              class="appearance-none bg-white border border-gray-300 rounded-md py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#4ee163] focus:border-transparent text-gray-700 cursor-pointer transition-all"
            >
              <option :value="5">
                5
              </option>
              <option :value="10">
                10
              </option>
              <option :value="20">
                20
              </option>
              <option :value="50">
                50
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <UIcon
                name="i-heroicons-chevron-down-20-solid"
                class="w-4 h-4"
              />
            </div>
          </div>
          <span>of {{ totalPosts }} results</span>
        </div>

        <div class="flex items-center gap-4">
          <button
            :disabled="page <= 1"
            class="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-30 transition-all flex items-center justify-center cursor-pointer"
            @click="page > 1 ? page-- : null"
          >
            <UIcon
              name="i-heroicons-chevron-left-20-solid"
              class="w-6 h-6"
            />
          </button>

          <div class="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-b from-[#b4f9a0] via-[#4ee163] to-[#30e3ca] p-[2px] shadow-sm">
            <div class="w-full h-full rounded-full bg-[#e9ffea] flex items-center justify-center text-gray-800 font-bold text-lg">
              {{ page }}
            </div>
          </div>

          <button
            :disabled="page >= totalPages"
            class="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-30 transition-all flex items-center justify-center cursor-pointer"
            @click="page < totalPages ? page++ : null"
          >
            <UIcon
              name="i-heroicons-chevron-right-20-solid"
              class="w-6 h-6"
            />
          </button>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

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
const perPage = ref(5) // Встановлюємо 5 за замовчуванням
const pending = ref(false)
const searchQuery = ref('')

// ОБЧИСЛЮЄМО ЗАГАЛЬНУ КІЛЬКІСТЬ СТОРІНОК
const totalPages = computed(() => {
  return Math.ceil(totalPosts.value / perPage.value) || 1
})

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
    // Додаємо per_page та search до запиту
    const response = await $fetch<ApiResponse>(
      `http://localhost/api/admin/blog/posts?page=${page.value}&per_page=${perPage.value}&search=${searchQuery.value}`
    )
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

watch([page, perPage, searchQuery], ([_newPage, newPerPage, newSearch], [_oldPage, oldPerPage, oldSearch]) => {
  if (newPerPage !== oldPerPage || newSearch !== oldSearch) {
    page.value = 1
  }
  fetchPosts()
})
</script>
