<script lang="ts" setup>
import { email, minLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

import { login } from '~/services/authService'

const initialState = {
  email: '',
  password: '',
}

const state = reactive({ ...initialState })
const isPasswordRevealed = ref(false)
const passwordInputRef = ref<HTMLInputElement | null>(null)

const rules = computed(() => ({
  email: { email },
  password: { minLength: minLength(32) },
}))

const v$ = useVuelidate(rules, state)

function resetForm() {
  Object.assign(state, initialState)
  v$.$reset()
}

function submit() {
  return login().finally(resetForm)
}

const { isSubmitting, submitForm } = useFormSubmission(submit)

function handleClick() {
  // we just toggle when password revealed or not
  isPasswordRevealed.value = !isPasswordRevealed.value

  nextTick(() => {
    // when toggling password revealing, we loose focus on the input
    // so to not loose UX, we make sure that the cursor is at the end.
    if (passwordInputRef.value) {
      const end = passwordInputRef.value.value.length
      // here we put the cursor at the end of the input.
      passwordInputRef.value.setSelectionRange(end, end)
      passwordInputRef.value.focus()
    }
  })
}
</script>

<template>
  <form class="login-form" @submit.prevent="submitForm">
    <h2 class="login-form__title">
      Login
    </h2>
    <p class="login-form__sign-in-text">
      Sign in into your account to continue.
    </p>

    <div class="mb-4">
      <label for="email" class="login-form__label">Email</label>
      <div class="login-form__control">
        <input
          id="email"
          v-model="v$.email.$model"
          data-testid="email"
          type="email"
          class="login-form__input"
          name="email"
        >
        <span class="login-form__icon-user" />
      </div>

      <ErrorList :errors="v$.email.$errors" data-testid="password-email-msg" />
    </div>
    <div class="mb-4">
      <label for="password" class="login-form__label">Password</label>
      <div class="login-form__control">
        <input
          id="password"
          ref="passwordInputRef"
          v-model="v$.password.$model"
          data-testid="password"
          :type="isPasswordRevealed ? 'text' : 'password'"
          class="login-form__input"
          name="password"
        >
        <button type="button" class="login-form__reveal-password" aria-label="reveal-password" @click="handleClick">
          <span data-testid="eye-icon" :class="[isPasswordRevealed ? 'login-form__icon-eye-off' : 'login-form__icon-eye-on']" />
        </button>
      </div>
      <ErrorList :errors="v$.password.$errors" data-testid="password-error-msg" />
    </div>
    <div class="login-form__footer">
      <button
        :disabled="isSubmitting || v$.$invalid || !v$.$dirty"
        class="login-form__submit" :class="[{ 'login-form__submit--disabled': isSubmitting || v$.$invalid || !v$.$dirty }]"
        data-testid="submit"
        @submit="submitForm"
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
  @apply  max-w-sm w-full rounded-lg p-8 shadow-lg;
  @apply bg-white dark:bg-gray-800;
}

.login-form__title {
  @apply mb-4 text-center text-2xl;
  @apply text-gray-900 dark:text-white;
}

.login-form__sign-in-text {
  @apply text-gray-600 dark:text-gray-300 mb-4 text-center;
}

.login-form__label {
  @apply mb-2 inline-block text-gray-500 dark:text-gray-300;
}

.login-form__input {
  @apply w-full appearance-none border rounded leading-tight shadow border-transparent focus-outline-none;
  @apply bg-gray-100 dark:bg-gray-700;
  @apply pl-3 pr-8 py-2;
  @apply placeholder:text-gray-800 dark:placeholder:text-gray-300;

  @apply focus:border-teal-400 dark:focus:border-sky-400;
  @apply focus:ring-teal-400 dark:focus:ring-sky-400;
  @apply focus-visible:border-teal-500 dark:focus-visible:border-sky-400;
}

.login-form__submit {
  @apply focus:shadow-outline rounded px-4 py-2 font-bold text-white focus:outline-none;
  @apply bg-teal-500 dark:bg-sky;
  @apply hover:bg-teal-600 dark:hover:bg-sky-800 ;
}

.login-form__submit--disabled {
  @apply disabled:opacity-75 disabled:pointer-events-none cursor-not-allowed ;
}

.login-form__forgot-password {
  @apply inline-block align-baseline text-sm font-bold  hover:text-blue-800 cursor: pointer;
  @apply text-teal-500 dark:text-sky;
}

.login-form__loading {
  @apply flex items-center;
}

.login-form__footer {
  @apply flex items-center justify-between;
}

.login-form__control {
  @apply relative;
}

.login-form__icon-user {
  @apply i-carbon-user block absolute top-2 right-2;
}

.login-form__icon-eye {
  @apply block absolute right-2;
  top: 0.6rem;
}

.login-form__icon-eye-on {
  @apply i-carbon-view block absolute right-2;

  top: 0.6rem;
}

.login-form__icon-eye-off {
  @apply i-carbon-view-off block absolute right-2;

  top: 0.6rem;
}

.login-form__reveal-password {
  all: unset;
  cursor: pointer;
}
</style>
