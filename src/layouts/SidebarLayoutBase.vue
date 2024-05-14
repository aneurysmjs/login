<script lang="ts" setup>
defineSlots<{
  default?: () => VNode | VNode[]
  sidebar?: () => VNode | VNode[]
}>()
</script>

<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-white">
    <body class="h-full">
    ```
  -->
  <div>
    <slot name="sidebar" />

    <main
      class="
        py-10

        lg:pl-72
      "
    >
      <div
        class="
          px-4

          lg:px-8

          sm:px-6
        "
      >
        <!-- <router-view /> -->
        <slot />
      </div>
    </main>
  </div>
</template>
