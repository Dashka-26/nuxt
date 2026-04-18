import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface GitHubProfile {
  login?: string
  name?: string
  avatar_url?: string
  [key: string]: unknown
}

export const useUserStore = defineStore('user', () => {
  const name = ref('Гість')
  const isLoggedIn = ref(false)
  const loginTime = ref<string | null>(null)

  const welcomeMessage = computed(() => `Вітаємо, ${name.value}!`)

  function login(userName: string) {
    name.value = userName
    isLoggedIn.value = true
    loginTime.value = new Date().toLocaleTimeString()
  }

  function logout() {
    name.value = 'Гість'
    isLoggedIn.value = false
    loginTime.value = null
  }

  const profileData = ref<GitHubProfile | null>(null)
  const isLoading = ref(false)

  async function fetchProfile() {
    isLoading.value = true
    try {
      const response = await $fetch<GitHubProfile>('https://api.github.com/users/octocat')
      profileData.value = response
    } catch (error) {
      console.error('Помилка завантаження:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    name,
    isLoggedIn,
    loginTime,
    welcomeMessage,
    profileData,
    isLoading,
    login,
    logout,
    fetchProfile
  }
})
