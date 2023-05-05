<script setup lang="ts">
function handleSubmit() {

}
</script>

<template>
  <section class="login">
    <div className="login__wrapper">
      <LoginForm />
    </div>
  </section>
</template>

<style>
.login {

}

.login__title {
  @apply text-center text-theme;
}

.login__wrapper {
  @apply bg-theme flex items-center justify-center;
}
</style>
