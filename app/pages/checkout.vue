<template>
  <div class="bg-white min-h-screen pb-12">
    <div class="bg-[#333333] py-4 text-center">
      <h1 class="text-white text-lg font-bold">
        Checkout
      </h1>
    </div>

    <div class="max-w-5xl mx-auto px-8 pt-8">
      <NuxtLink
        to="/"
        class="text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium mb-6 inline-block"
      >
        &lt;&lt; back
      </NuxtLink>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          You're Almost In - Start Your 3-Day Free Trial Now!
        </h2>
        <p class="text-gray-600 text-lg">
          Set up your account to gain instant access! You won't be charged if you decide to cancel within 3 days
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-10 items-start">
        <div class="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] w-full overflow-hidden border border-gray-100 flex flex-col">
          <div :class="`h-1.5 w-full bg-gradient-to-r ${data?.plan.color}`" />

          <div class="p-8 flex-grow">
            <h3 class="text-xl font-bold text-gray-800 mb-4">
              {{ data?.plan.name }}
            </h3>

            <span class="inline-block bg-gray-100 text-gray-500 text-[11px] font-semibold px-2 py-1 rounded mb-3">
              {{ data?.plan.trialText }}
            </span>

            <div class="flex items-baseline mb-1">
              <span class="text-[2.75rem] font-extrabold text-gray-800 leading-none">
                ${{ data?.plan.price }}
              </span>
              <span class="text-gray-400 font-medium ml-1">
                /month
              </span>
            </div>

            <p class="text-gray-500 text-xs mb-2">
              billed yearly at
              <span class="line-through">
                {{ data?.plan.oldYearly }}
              </span>
              <span class="font-semibold text-gray-800">
                {{ data?.plan.newYearly }}
              </span>
            </p>

            <span class="inline-block bg-[#e9ffea] text-green-600 text-xs font-bold px-2 py-1 rounded mb-6">
              {{ data?.plan.savings }}
            </span>

            <ul class="space-y-3.5">
              <li
                v-for="(feature, idx) in data?.plan.features"
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

        <form
          class="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 p-8"
          @submit.prevent="submitCheckout"
        >
          <h3 class="font-bold text-gray-800 text-lg mb-6">
            Order Summary
          </h3>

          <div class="flex justify-between items-center text-sm text-gray-600 mb-4">
            <span>
              Annual Plan
            </span>
            <span>
              ${{ data?.summary.annualPlan }}
            </span>
          </div>

          <div class="flex justify-between items-center text-sm text-gray-600 mb-4 pt-4 border-t border-gray-300">
            <span>
              Total Due
              <span class="text-[11px] text-gray-400">
                (*not including sales tax where applicable)
              </span>
            </span>
            <span>
              ${{ data?.summary.totalDue }}
            </span>
          </div>

          <div class="flex justify-between items-center font-bold text-gray-800 mb-6">
            <span>
              Due Today
            </span>
            <span>
              ${{ data?.summary.dueToday }}
            </span>
          </div>

          <div class="bg-gray-50 text-center py-2.5 rounded text-gray-500 font-medium text-sm mb-8">
            Includes 3-Day Free Trial
          </div>

          <div class="flex items-center gap-1.5 mb-4">
            <h3 class="font-bold text-gray-800 text-lg">
              Billing Information
            </h3>
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div class="mb-6">
            <label class="block text-sm text-gray-500 mb-1">
              Card Details
            </label>
            <div class="flex border border-gray-300 rounded-md overflow-hidden bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <div class="flex items-center pl-3 pr-2 border-r border-gray-200">
                <svg
                  class="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <input
                v-model="form.cardNumber"
                type="text"
                placeholder="Number"
                class="flex-grow py-2.5 px-3 outline-none text-sm text-gray-700 placeholder-gray-400 border-r border-gray-200"
                required
              >
              <input
                v-model="form.expiry"
                type="text"
                placeholder="MM / YY"
                class="w-24 py-2.5 px-3 outline-none text-sm text-gray-700 placeholder-gray-400 border-r border-gray-200"
                required
              >
              <input
                v-model="form.cvc"
                type="text"
                placeholder="CVC"
                class="w-20 py-2.5 px-3 outline-none text-sm text-gray-700 placeholder-gray-400"
                required
              >
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm text-gray-500 mb-1">
              Address
            </label>

            <div class="border border-gray-300 rounded-t-md p-3 bg-white mb-[-1px]">
              <label class="block text-xs text-gray-500 mb-1">
                Full name
              </label>
              <input
                v-model="form.fullName"
                type="text"
                class="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-500"
                required
              >
            </div>

            <div class="border border-gray-300 rounded-b-md p-3 bg-white">
              <label class="block text-xs text-gray-500 mb-1">
                Address
              </label>
              <input
                v-model="form.address"
                type="text"
                class="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-500"
                required
              >
            </div>
          </div>

          <div class="flex items-start gap-3 mb-6">
            <input
              v-model="consent"
              type="checkbox"
              class="mt-1 w-4 h-4 border-gray-300 rounded cursor-pointer"
              required
            >
            <p class="text-[11px] text-gray-600 leading-tight">
              I consent to
              <a
                href="#"
                class="font-bold underline"
              >
                Terms of Use
              </a>
              and understand my 3-day free trial will automatically convert to ${{ data?.summary.totalDue }} per year starting on 04/02/2026. The yearly fee will be automatically charged each year going forward unless I cancel my account at least one (1) business day before the end of the current billing period, which can be done by calling (888) 463-3163.
            </p>
          </div>

          <button
            type="submit"
            :disabled="isLoading || !consent"
            :class="consent ? 'bg-[#e6e6e6] text-gray-800 hover:bg-gray-300' : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
            class="w-32 font-bold py-2.5 rounded transition-all shadow-sm text-sm"
          >
            {{ isLoading ? 'Processing...' : 'Try It Free' }}
          </button>

          <div
            v-if="successMessage"
            class="mt-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded text-sm text-center"
          >
            {{ successMessage }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useHead, useFetch } from '#imports'

useHead({
  title: 'Оплата підписки'
})

const route = useRoute()

const { data } = await useFetch('/api/checkout', {
  query: { plan: route.query.plan || 2 }
})

const isLoading = ref(false)
const successMessage = ref('')
const consent = ref(false)

const form = ref({
  cardNumber: '',
  expiry: '',
  cvc: '',
  fullName: '',
  address: ''
})

const submitCheckout = async () => {
  if (!consent.value) return

  isLoading.value = true
  successMessage.value = ''

  try {
    const response = await $fetch('/api/subscription/create', {
      method: 'POST',
      body: form.value
    })

    if (response.success) {
      successMessage.value = response.message
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>
