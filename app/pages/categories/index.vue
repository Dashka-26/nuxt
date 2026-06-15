<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">
        Керування категоріями
      </h1>
      <UButton
        to="/categories/create"
        color="primary"
      >
        Додати категорію
      </UButton>
    </div>

    <UCard>
      <div class="mb-4 flex justify-start">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Пошук за назвою..."
          class="w-full max-w-sm"
        />
      </div>

      <UTable
        :data="categories"
        :columns="columns"
        :loading="pending"
      >
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
          <span>of {{ totalCategories }} results</span>
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

interface Category {
  id: number
  title: string
  slug: string
  parent_title: string | null
}

const page = ref(1)
const categories = ref<Category[]>([])
const totalCategories = ref(0)
const perPage = ref(5)
const pending = ref(false)
const searchQuery = ref('')

// ОБЧИСЛЮЄМО ЗАГАЛЬНУ КІЛЬКІСТЬ СТОРІНОК
const totalPages = computed(() => {
  return Math.ceil(totalCategories.value / perPage.value) || 1
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: any[] = [
  { accessorKey: 'id', header: '#' },
  { accessorKey: 'title', header: 'Назва' },
  { accessorKey: 'slug', header: 'Slug' },
  { accessorKey: 'parent_title', header: 'Батьківська категорія' },
  { id: 'actions', header: 'Дії' }
]

const getActionItems = (row: Category) => [
  [
    {
      label: 'Редагувати',
      icon: 'i-heroicons-pencil-square-20-solid',
      to: `/categories/${row.id}/edit`
    }
  ],
  [
    {
      label: 'Видалити',
      icon: 'i-heroicons-trash-20-solid',
      onSelect: () => deleteCategory(row.id)
    }
  ]
]

const fetchCategories = async () => {
  pending.value = true
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await $fetch<any>(`http://localhost/api/admin/blog/categories?page=${page.value}&per_page=${perPage.value}&search=${searchQuery.value}`)
    categories.value = response.data
    totalCategories.value = response.meta?.total || response.total || 0
  } catch (error) {
    console.error(error)
  } finally {
    pending.value = false
  }
}

const deleteCategory = async (id: number) => {
  if (!confirm('Ви впевнені, що хочете видалити цю категорію?')) return
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await $fetch<any>(`http://localhost/api/admin/blog/categories/${id}`, { method: 'DELETE' })
    // Показуємо повідомлення про успішне видалення
    alert(response.message || 'Категорію успішно видалено!')
    fetchCategories()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Помилка видалення:', error)
    // Витягуємо текст помилки з бекенду (наприклад "Видалення неможливе: до категорії прив'язано 5 статей")
    const errorMessage = error.response?._data?.message || 'Сталася невідома помилка при видаленні'
    // Виводимо алерт для користувача
    alert(`${errorMessage}`)
  }
}

fetchCategories()

watch([page, perPage, searchQuery], ([_newPage, newPerPage, newSearch], [_oldPage, oldPerPage, oldSearch]) => {
  // Якщо змінився ліміт або пошук - кидаємо на першу сторінку
  if (newPerPage !== oldPerPage || newSearch !== oldSearch) {
    page.value = 1
  }
  fetchCategories()
})
</script>
