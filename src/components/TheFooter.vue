<template>
  <footer class="footer">
    <nav class="footer__nav">
      <button
        icon-btn
        aria-label="toggle theme"
        @click="toggleDark()"
      >
        <div
          i-carbon-sun
          dark:i-carbon-moon
        />
      </button>

      <a
        i-carbon-logo-github
        icon-btn
        rel="noreferrer"
        href="https://github.com/antfu/vitesse-lite"
        target="_blank"
        title="GitHub"
      />
    </nav>
  </footer>
</template>

<style>
.footer {
  @apply text-center w-full pb-4;
}

.footer__nav {
  @apply text-center mt-6 inline-flex gap-2 text-xl;
}
</style>
