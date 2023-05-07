import type { UnwrapRef } from 'vue'

export default function useFormSubmission<CB extends (...args: any[]) => Promise<any>>(cb: CB) {
  const isSubmitting = ref(false)
  const result = ref<Awaited<ReturnType<CB>> | null>(null)

  async function submitForm() {
    try {
      isSubmitting.value = true

      const response = await cb()

      // Set the result to the data returned from the API
      result.value = response as UnwrapRef<Awaited<ReturnType<CB>>>

      isSubmitting.value = false
    }
    catch (error) {
      console.error(error)
      isSubmitting.value = false
    }
  }

  return {
    isSubmitting,
    result,
    submitForm,
  }
}
