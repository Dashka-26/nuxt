<template>
  <div class="bg-gray-50 min-h-screen p-8">
    <div class="max-w-6xl mx-auto flex flex-col items-center">
      <div class="w-full flex justify-between items-center mb-10">
        <h1 class="text-3xl font-bold text-gray-800">
          Start Your 3 Day Free Trial
        </h1>
        <div class="flex items-center gap-2 text-sm">
          <span class="text-green-500 font-medium">
            Save up to 20%
          </span>
          <div class="flex border border-gray-200 rounded-md overflow-hidden bg-white">
            <button class="px-4 py-1.5 font-medium border-r border-gray-200">
              Annual
            </button>
            <button class="px-4 py-1.5 text-gray-500 bg-gray-50">
              Monthly
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-6 justify-center w-full">
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="bg-white rounded-xl shadow-sm w-full max-w-[360px] overflow-hidden border border-gray-200 transition-all duration-300 hover:border-black flex flex-col"
        >
          <div :class="`h-1.5 w-full bg-gradient-to-r ${plan.color}`" />

          <div class="p-8 flex-grow">
            <h2 class="text-xl font-bold text-gray-800 mb-4">
              {{ plan.name }}
            </h2>

            <span class="inline-block bg-gray-100 text-gray-500 text-[11px] font-semibold px-2 py-1 rounded mb-3">
              {{ plan.trialText }}
            </span>

            <div class="flex items-baseline mb-1">
              <span class="text-[2.75rem] font-extrabold text-gray-800 leading-none">
                ${{ plan.price }}
              </span>
              <span class="text-gray-400 font-medium ml-1">
                /month
              </span>
            </div>

            <p class="text-gray-500 text-xs mb-2">
              billed yearly at
              <span class="line-through">
                {{ plan.oldYearly }}
              </span>
              <span class="font-semibold text-gray-800">
                {{ plan.newYearly }}
              </span>
            </p>

            <span class="inline-block bg-[#e9ffea] text-green-600 text-xs font-bold px-2 py-1 rounded mb-6">
              {{ plan.savings }}
            </span>

            <button
              class="w-full block text-center bg-gradient-to-r from-[#ffcf00] to-[#ff9800] text-gray-900 font-bold py-2.5 rounded transition-all hover:opacity-90 mb-6 shadow-sm"
              @click="handleSelectPlan(plan)"
            >
              Try It Free
            </button>

            <hr class="border-gray-100 mb-6" />

            <ul class="space-y-3.5">
              <li
                v-for="(feature, idx) in plan.features"
                :key="idx"
                class="flex items-start gap-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 mt-1 flex-shrink-0"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#73ff00"
                    d="M12 1L9 9l-8 3l8 3l3 8l3-8l8-3l-8-3z"
                  />
                </svg>
                <div>
                  <p class="text-gray-600 text-[13px] leading-tight">
                    <span
                      v-if="feature.boldText"
                      v-html="feature.text.replace(feature.boldText, `<span class='font-bold text-gray-800'>${feature.boldText}</span>`)"
                    />
                    <span v-else>
                      {{ feature.text }}
                    </span>
                  </p>
                  <p
                    v-if="feature.subtext"
                    class="text-gray-400 text-xs mt-0.5"
                  >
                    {{ feature.subtext }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHead, useFetch, navigateTo } from '#imports'
import { useSubscriptionStore } from '~/stores/useSubscriptionStore'

useHead({
  title: 'Список продуктів'
})

const { data: plans } = await useFetch('/api/plans')
const subscriptionStore = useSubscriptionStore()
const handleSelectPlan = (plan) => {
  subscriptionStore.setPlan(plan)
  navigateTo('/checkout')
}
</script>
