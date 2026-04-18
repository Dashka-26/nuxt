<template>
  <div class="bg-gray-50 min-h-screen p-8">
    <div class="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 mt-10">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">
        {{ welcomeMessage }}
      </h1>

      <div v-if="!isLoggedIn" class="mb-8">
        <label class="block text-sm text-gray-500 mb-2">
          Введіть ваше ім'я:
        </label>
        <div class="flex gap-3">
          <input
            v-model="inputName"
            type="text"
            placeholder="Наприклад: Іван"
            class="flex-grow border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
            @keyup.enter="handleLogin"
          >
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
            @click="handleLogin"
          >
            Увійти
          </button>
        </div>
      </div>

      <div
        v-else
        class="bg-green-50 text-green-800 p-5 rounded-lg border border-green-200 mb-8"
      >
        <p class="mb-4">
          Ви успішно зайшли в систему о <span class="font-bold">{{ loginTime }}</span>
        </p>
        <button
          class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors"
          @click="userStore.logout"
        >
          Вийти
        </button>
      </div>

      <div class="border-t border-gray-100 pt-8">
        <h2 class="text-lg font-bold text-gray-800 mb-4">
          Асинхронний запит через Pinia
        </h2>

        <button
          class="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
          :disabled="isLoading"
          @click="userStore.fetchProfile"
        >
          {{ isLoading ? 'Завантаження...' : 'Завантажити профіль GitHub' }}
        </button>

        <div
          v-if="profileData"
          class="mt-6 flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <img
            :src="profileData.avatar_url"
            alt="GitHub Avatar"
            class="w-16 h-16 rounded-full border border-gray-300"
          >
          <div>
            <p class="font-bold text-gray-900">
              {{ profileData.name || profileData.login }}
            </p>
            <a
              :href="`https://github.com/${profileData.login}`"
              target="_blank"
              class="text-sm text-blue-500 hover:underline"
            >
              @{{ profileData.login }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useHead } from '#imports'

useHead({
  title: 'Тест Pinia Store'
})

const userStore = useUserStore()
const { isLoggedIn, welcomeMessage, loginTime, profileData, isLoading } = storeToRefs(userStore)

const inputName = ref('')

const handleLogin = () => {
  if (inputName.value.trim()) {
    userStore.login(inputName.value.trim())
    inputName.value = ''
  }
}
</script>
