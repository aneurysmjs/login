<script lang="ts" setup>
import type { FunctionalComponent, HTMLAttributes, VNodeProps } from 'vue'
import {
  Bars3Icon,
} from '@heroicons/vue/24/outline'

export interface Navigation {
  current: boolean
  href: string
  icon: FunctionalComponent<HTMLAttributes & VNodeProps, Record<string, any>, any, Record<string, any>>
  name: string
}

export interface SidebarProps {
  navigation: Navigation[]
}

const props = defineProps<SidebarProps>()

const emit = defineEmits<{
  open: []
}>()
</script>

<template>
  <div
    class="
      hidden

      lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col
    "
  >
    <!-- Sidebar component, swap this element with another sidebar if you like -->
    <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
      <div class="flex h-16 shrink-0 items-center">
        <img
          class="h-8 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
          alt="Your Company"
        >
      </div>
      <nav class="flex flex-1 flex-col">
        <ul
          role="list"
          class="flex flex-1 flex-col gap-y-7"
        >
          <li>
            <ul
              role="list"
              class="-mx-2 space-y-1"
            >
              <li
                v-for="item in props.navigation"
                :key="item.name"
              >
                <router-link
                  :to="item.href"
                  class="
                    group flex gap-x-3 rounded-md p-2 text-sm font-semibold
                    leading-6
                  "
                  :class="[item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800']"
                >
                  <component
                    :is="item.icon"
                    class="h-6 w-6 shrink-0"
                    aria-hidden="true"
                  />
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </li>
          <li class="-mx-6 mt-auto">
            <a
              href="#"
              class="
                flex items-center gap-x-4 px-6 py-3 text-sm font-semibold
                leading-6 text-white

                hover:bg-gray-800
              "
            >
              <img
                class="h-8 w-8 rounded-full bg-gray-800"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZKhJxavNtuoXqsFNhygnVTiWToGH04ebrJw&usqp=CAU"
                alt=""
              >
              <span class="sr-only">Your profile</span>
              <span aria-hidden="true">Jero</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>

  <div
    class="
      sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4
      shadow-sm

      lg:hidden

      sm:px-6
    "
  >
    <button
      type="button"
      class="
        -m-2.5 p-2.5 text-gray-400

        lg:hidden
      "
      @click="emit('open')"
    >
      <span class="sr-only">Open sidebar</span>
      <Bars3Icon
        class="h-6 w-6"
        aria-hidden="true"
      />
    </button>
    <div class="flex-1 text-sm font-semibold leading-6 text-white">
      Dashboard
    </div>
    <a href="#">
      <span class="sr-only">Your profile</span>
      <img
        class="h-8 w-8 rounded-full bg-gray-800"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZKhJxavNtuoXqsFNhygnVTiWToGH04ebrJw&usqp=CAU"
        alt=""
      >
    </a>
  </div>
</template>
