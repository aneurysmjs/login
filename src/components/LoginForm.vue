<script lang="ts" setup>
import { Form } from 'vee-validate'
import { email, minLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

const initialState = {
  email: '',
  password: '',
}

const state = reactive({ ...initialState })

const rules = computed(() => ({
  email: { email },
  password: { minLength: minLength(32) },
}))

const v$ = useVuelidate(rules, state)

function resetForm() {
  Object.assign(state, initialState)
  v$.$reset()
}

function handleSubmit() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ok: true })

      resetForm()
    }
    , 1500)
  })
}
</script>

<template>
  <Form v-slot="{ isSubmitting }" class="login-form" @submit="handleSubmit">
    <h2 class="login-form__title">
      Login
    </h2>
    <p class="login-form__sign-in-text">
      Sign in into your account to continue.
    </p>

    <div class="mb-4">
      <label for="email" class="login-form__label">Email</label>
      <input
        id="email"
        v-model="v$.email.$model"
        data-testid="email"
        type="email"
        class="login-form__input"
        autocomplete="off"
      >
      <p
        v-for="error of v$.email.$errors"
        :key="error.$uid"
      >
        <span class="login-form__invalid-field" data-testid="password-email-msg">{{ error.$message }}</span>
      </p>
    </div>
    <div class="mb-4">
      <label for="password" class="login-form__label">Password</label>
      <input
        id="password"
        v-model="v$.password.$model"
        data-testid="password"
        type="password"
        class="login-form__input"
      >
      <p
        v-for="error of v$.password.$errors"
        :key="error.$uid"
      >
        <span class="login-form__invalid-field" data-testid="password-error-msg">{{ error.$message }}</span>
      </p>
    </div>
    <div class="flex items-center justify-between">
      <button
        :disabled="isSubmitting || v$.$invalid || !v$.$dirty"
        class="login-form__submit" :class="[{ 'login-form__submit--disabled': isSubmitting || v$.$invalid || !v$.$dirty }]"
        type="submit"
        data-testid="submit"
        @submit="handleSubmit"
      >
        Submit
      </button>
      <BaseLoader v-if="isSubmitting" />
      <a
        href="#"
        class="login-form__forgot-password"
      >
        Forgot Password?
      </a>
    </div>
  </form>
</template>

<style scoped>
.login-form {
  @apply max-w-md w-full rounded-lg p-8 shadow-lg;
  @apply bg-white dark:bg-gray-800;
}

.login-form__title {
  @apply mb-4 text-center text-2xl;
  @apply text-gray-900 dark:text-white;
}

.login-form__sign-in-text {
  @apply text-gray-900 dark:text-gray-400 mb-4 text-center;
}

.login-form__label {
  @apply mb-2 block text-gray-500;
}

.login-form__input {
  @apply w-full appearance-none border rounded px-3 py-2 leading-tight shadow border-transparent;
  @apply bg-gray-100 dark:bg-gray-700;

  @apply placeholder:text-gray-800 dark:placeholder:text-gray-300;

  @apply focus:border-teal-400 dark:focus:border-sky-400 focus-visible:border-teal-500 dark:focus-visible:border-sky-400;
  @apply focus:ring-teal-400 dark:focus:ring-sky-400;

  @apply focus-outline-none;
}

.login-form__submit {
  @apply focus:shadow-outline rounded px-4 py-2 font-bold text-white  focus:outline-none;
  @apply bg-teal-500 dark:bg-sky;
  @apply hover:bg-teal-600 dark:hover:bg-sky-800
}

.login-form__submit--disabled {
  @apply disabled:bg-teal-400 dark:disabled:bg-sky-4 cursor-not-allowed;
}

.login-form__forgot-password {
  @apply inline-block align-baseline text-sm font-bold  hover:text-blue-800 cursor: pointer;
  @apply text-teal-500 dark:text-sky;
}

.login-form__invalid-field {
  @apply text-xs italic text-red-500 mt-2;
}

.login-form__loading {
  @apply flex items-center;
}
</style>
