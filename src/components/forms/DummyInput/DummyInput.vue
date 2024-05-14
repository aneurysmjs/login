<script lang="ts" setup>
import type { Events, InputHTMLAttributes } from 'vue'

interface DummyInputProps {
  label?: string
  modelValue: string
  placeholder?: string
}

const props = defineProps<DummyInputProps>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function handleInput(evt: Event) {
  const value = (evt.target as HTMLInputElement).value

  emit('update:modelValue', value)
}
</script>

<template>
  <input

    :value="props.modelValue"
    class="
      block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
      ring-inset ring-gray-300

      focus:ring-2 focus:ring-inset focus:ring-indigo-600

      placeholder:text-gray-400

      sm:text-sm sm:leading-6
    "
    :placeholder="props?.placeholder"
    @input="handleInput"
  >
</template>
