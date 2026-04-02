<template>
  <div class="bg-gray-100 min-h-screen p-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Пошук за назвою..."
          class="w-80"
        />
      </div>

      <div class="flex justify-between items-center mb-4 text-sm">
        <div class="text-gray-500">
          {{ selected.length }} selected
        </div>
        <div class="flex items-center gap-6 text-gray-700 font-medium cursor-pointer">
          <div class="flex items-center gap-1 hover:text-gray-900 transition-colors">
            <svg
              class="w-5 h-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 6h16M7 12h10m-6 6h2"
              />
            </svg>
            <span>Sort by</span>
          </div>
          <div class="flex items-center gap-1 hover:text-gray-900 transition-colors">
            <svg
              class="w-5 h-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="3"
                d="M12 6h.01M12 12h.01M12 18h.01"
              />
            </svg>
            <span>Actions</span>
          </div>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <UTable
            :data="paginatedRows"
            :columns="columns"
            class="w-full text-sm text-left"
            :ui="{
              th: { base: 'text-left font-medium py-3 px-4 text-gray-500 border-b border-gray-200 whitespace-nowrap' },
              td: { padding: 'py-4 px-4', color: 'text-gray-700 align-middle' },
              tr: { base: 'border-b border-gray-100 hover:bg-gray-50 transition-colors' }
            }"
          >
            <template #title-header>
              <button
                class="flex items-center gap-1 hover:text-gray-900 transition-colors outline-none font-medium w-full text-left"
                @click="handleSort('title')"
              >
                Назва
                <span
                  v-if="sort.column === 'title'"
                  class="text-green-500 font-bold"
                >
                  {{ sort.direction === 'asc' ? '↑' : '↓' }}
                </span>
              </button>
            </template>

            <template #brand-header>
              <button
                class="flex items-center gap-1 hover:text-gray-900 transition-colors outline-none font-medium w-full text-left"
                @click="handleSort('brand')"
              >
                Бренд
                <span
                  v-if="sort.column === 'brand'"
                  class="text-green-500 font-bold"
                >
                  {{ sort.direction === 'asc' ? '↑' : '↓' }}
                </span>
              </button>
            </template>

            <template #category-header>
              <button
                class="flex items-center gap-1 hover:text-gray-900 transition-colors outline-none font-medium w-full text-left"
                @click="handleSort('category')"
              >
                Категорія
                <span
                  v-if="sort.column === 'category'"
                  class="text-green-500 font-bold"
                >
                  {{ sort.direction === 'asc' ? '↑' : '↓' }}
                </span>
              </button>
            </template>

            <template #price-header>
              <button
                class="flex items-center gap-1 hover:text-gray-900 transition-colors outline-none font-medium w-full text-left"
                @click="handleSort('price')"
              >
                Ціна
                <span
                  v-if="sort.column === 'price'"
                  class="text-green-500 font-bold"
                >
                  {{ sort.direction === 'asc' ? '↑' : '↓' }}
                </span>
              </button>
            </template>

            <template #rating-header>
              <button
                class="flex items-center gap-1 hover:text-gray-900 transition-colors outline-none font-medium w-full text-left"
                @click="handleSort('rating')"
              >
                Оцінка
                <span
                  v-if="sort.column === 'rating'"
                  class="text-green-500 font-bold"
                >
                  {{ sort.direction === 'asc' ? '↑' : '↓' }}
                </span>
              </button>
            </template>

            <template #select-header>
              <div class="flex items-center gap-1">
                <input
                  type="checkbox"
                  class="border-gray-300 rounded cursor-pointer"
                  :checked="filteredRows.length > 0 && selected.length === filteredRows.length"
                  @change="toggleAll"
                >
                <UIcon
                  name="i-heroicons-chevron-down"
                  class="w-4 h-4 text-gray-400"
                />
              </div>
            </template>

            <template #select-cell="{ row }">
              <input
                v-model="selected"
                type="checkbox"
                :value="row.original"
                class="border-gray-300 rounded cursor-pointer"
                @click.stop
              >
            </template>

            <template #thumbnail-cell="{ row }">
              <img
                :src="row.original.thumbnail"
                alt="product thumbnail"
                class="w-[100px] h-[100px] min-w-[100px] object-cover rounded-md border border-gray-100 shadow-sm"
              />
            </template>

            <template #title-cell="{ row }">
              <span class="font-medium text-gray-900">
                {{ row.original.title }}
              </span>
            </template>

            <template #description-cell="{ row }">
              <div
                class="max-w-[250px] truncate text-gray-500"
                :title="row.original.description"
              >
                {{ row.original.description }}
              </div>
            </template>

            <template #price-cell="{ row }">
              <span class="font-semibold text-gray-900">
                ${{ row.original.price }}
              </span>
            </template>

            <template #rating-cell="{ row }">
              <span :class="row.original.rating < 4.5 ? 'text-red-500 font-bold' : 'text-green-500 font-bold'">
                {{ row.original.rating }}
              </span>
            </template>

            <template #brand-cell="{ row }">
              <span class="text-gray-600">
                {{ row.original.brand || '-' }}
              </span>
            </template>

            <template #category-cell="{ row }">
              <span class="text-gray-600 capitalize">
                {{ row.original.category }}
              </span>
            </template>
          </UTable>
        </div>

        <div class="border-t border-gray-100 p-4 flex justify-between items-center text-sm text-gray-500 bg-white">
          <div class="flex items-center gap-2">
            <span>Show</span>
            <select
              v-model="pageCount"
              class="w-12 py-1 px-1 text-center border border-gray-200 rounded text-gray-700 outline-none cursor-pointer hover:border-gray-300"
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
            </select>
            <span>of {{ filteredRows.length }} results</span>
          </div>

          <div class="flex items-center gap-3">
            <button
              :disabled="page === 1"
              class="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-50 transition-all"
              @click="page > 1 ? page-- : null"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div class="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-b from-[#b4f9a0] via-[#4ee163] to-[#30e3ca] p-[2px]">
              <div class="w-full h-full rounded-full bg-[#e9ffea] flex items-center justify-center text-gray-800 font-bold text-lg">
                {{ page }}
              </div>
            </div>

            <button
              :disabled="page >= totalPages"
              class="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-50 transition-all"
              @click="page < totalPages ? page++ : null"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const { data: res } = await useFetch('https://dummyjson.com/products?limit=100')
const products = computed(() => res.value?.products || [])

const searchQuery = ref('')
const selected = ref([])
const page = ref(1)
const pageCount = ref(5)

const sort = ref({ column: '', direction: 'asc' })

const columns = [
  { id: 'select', header: '' },
  { accessorKey: 'thumbnail', header: 'Фото' },
  { accessorKey: 'title', header: 'Назва' },
  { accessorKey: 'brand', header: 'Бренд' },
  { accessorKey: 'category', header: 'Категорія' },
  { accessorKey: 'price', header: 'Ціна' },
  { accessorKey: 'rating', header: 'Оцінка' },
  { accessorKey: 'description', header: 'Опис' }
]

const toggleAll = (event) => {
  if (event.target.checked) {
    selected.value = [...filteredRows.value]
  } else {
    selected.value = []
  }
}

const handleSort = (col) => {
  if (sort.value.column === col) {
    sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value.column = col
    sort.value.direction = 'asc'
  }
  page.value = 1
}

const filteredRows = computed(() => {
  let result = [...products.value]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.title?.toLowerCase().includes(q)
      || p.brand?.toLowerCase().includes(q)
      || p.category?.toLowerCase().includes(q)
    )
  }

  if (sort.value.column) {
    const col = sort.value.column
    const isDesc = sort.value.direction === 'desc'

    result.sort((a, b) => {
      let aVal = a[col]
      let bVal = b[col]

      if (aVal === null || aVal === undefined) {
        aVal = ''
      }
      if (bVal === null || bVal === undefined) {
        bVal = ''
      }
      if (typeof aVal === 'string') {
        aVal = aVal.trim().toLowerCase()
      }
      if (typeof bVal === 'string') {
        bVal = bVal.trim().toLowerCase()
      }
      if (aVal === bVal) {
        return 0
      }
      if (aVal === '') {
        return 1
      }
      if (bVal === '') {
        return -1
      }

      const comparison = aVal < bVal ? -1 : 1
      return isDesc ? -comparison : comparison
    })
  }

  return result
})

const paginatedRows = computed(() => {
  const start = (page.value - 1) * pageCount.value
  const end = start + pageCount.value
  return filteredRows.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredRows.value.length / pageCount.value) || 1)

watch(searchQuery, () => {
  page.value = 1
})
</script>
