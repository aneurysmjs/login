<template>
  <main className="base-layout">
    <div className="base-layout__content">
      <RouterView />
    </div>
    <TheFooter />
  </main>
</template>

<style>
.base-layout {
  @apply flex flex-col h-screen;
}

.base-layout__content {
  @apply grow mt-16;
}
</style>
