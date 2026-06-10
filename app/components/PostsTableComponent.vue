<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-center">
      <div class="w-full">
        <nav class="navbar bg-gray-100 p-4 mb-4 rounded">
          <a href="/admin/blog/posts/create" class="text-blue-600 font-bold">
            Додати
          </a>
        </nav>
        <div class="card bg-white shadow-md rounded">
          <div class="card-body p-4">
            <table class="table-auto w-full text-left">
              <thead>
              <tr class="bg-gray-200">
                <th class="p-2">
                  #
                </th>
                <th class="p-2">
                  Автор
                </th>
                <th class="p-2">
                  Категорія
                </th>
                <th class="p-2">
                  Заголовок
                </th>
                <th class="p-2">
                  Дата публікації
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="post in posts" :key="post.id" class="border-b">
                <td class="p-2">
                  {{ post.id }}
                </td>
                <td class="p-2">
                  {{ post.user?.name || 'Невідомо' }}
                </td>
                <td class="p-2">
                  {{ post.category?.title || 'Без категорії' }}
                </td>
                <td class="p-2">
                  <a :href="'/admin/blog/posts/' + post.id + '/edit'" class="text-blue-500 hover:underline">
                    {{ post.title }}
                  </a>
                </td>
                <td class="p-2">
                  {{ post.published_at }}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Post {
  id: number
  title: string
  published_at: string | null
  category: { title: string } | null
  user: { name: string } | null
}

const posts = ref<Post[]>([])

const getPosts = () => {
  $fetch<{ data: Post[] }>('http://localhost/api/admin/blog/posts')
    .then((response) => {
      console.log(response)
      posts.value = response.data
    })
    .catch((error) => {
      console.error('Помилка завантаження:', error)
    })
}

getPosts()
</script>
