<script lang="ts" setup>
import {
  HomeIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'

import SidebarLayoutBase from './SidebarLayoutBase.vue'

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon, current: true },
  { name: 'Users', href: '/users', icon: UsersIcon, current: false },
]

const isOpen = ref(false)

function handleOpen() {
  isOpen.value = true
}

function handleClose() {
  isOpen.value = false
}
</script>

<template>
  <SidebarLayoutBase>
    <template #sidebar>
      <SidebarMobile
        :navigation
        :is-open="isOpen"
        @close="handleClose"
      />

      <!-- Static sidebar for desktop -->
      <Sidebar
        :navigation
        @open="handleOpen"
      />
    </template>

    <template #default>
      <RouterView />
    </template>
  </SidebarLayoutBase>
</template>
