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
      <UTable
        :data="categories"
        :columns="columns"
        :loading="pending"
      >
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
          :total="totalCategories"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

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
    const response = await $fetch<any>(`http://localhost/api/admin/blog/categories?page=${page.value}`)
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
    await $fetch(`http://localhost/api/admin/blog/categories/${id}`, { method: 'DELETE' })
    fetchCategories()
  } catch (error) {
    console.error(error)
  }
}

fetchCategories()

watch(page, () => {
  fetchCategories()
})
</script>
