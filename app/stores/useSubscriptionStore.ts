import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSubscriptionStore = defineStore('subscription', () => {
  const selectedPlan = ref<any>(null)
  const annualTotal = computed(() => {
    if (!selectedPlan.value || !selectedPlan.value.newYearly) return '0.00'
    const num = selectedPlan.value.newYearly.replace(/[^0-9.]/g, '')
    return Number(num).toFixed(2)
  })

  // Actions: Збереження та очищення плану
  function setPlan(plan: any) {
    selectedPlan.value = plan
  }

  function clearPlan() {
    selectedPlan.value = null
  }

  return {
    selectedPlan,
    annualTotal,
    setPlan,
    clearPlan
  }
})
