<script lang="ts" setup>
import type { ErrorObject } from '@vuelidate/core'

const props = defineProps<{
  errors: ErrorObject[]
}>()

const attrs = useAttrs()
</script>

<template>
  <ul>
    <li
      v-for="error of props.errors"
      :key="error.$uid"
      class="mt-2"
    >
      <span
        v-bind="attrs"
        class="error-list__message"
        role="alert"
      >
        {{ error.$message }}
      </span>
    </li>
  </ul>
</template>

<style>
.error-list__message {
  @apply text-xs italic text-red-500;
}
</style>
