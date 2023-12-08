<script lang="ts" setup>
import { ref } from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

interface Option {
  id: string | number
  value: string
}

interface BaseSelectProps {
  options: Option[]
  label?: string
}

const props = defineProps<BaseSelectProps>()

const defaultSelected = ref(props.options[0])
</script>

<template>
  <Listbox
    v-model="defaultSelected"
    as="div"
  >
    <ListboxLabel
      v-if="props.label !== ''"
      class="base-select__label"
    >
      {{ label }}
    </ListboxLabel>
    <div class="relative">
      <ListboxButton class="base-select__button">
        <span class="block truncate">{{ defaultSelected.value }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            class="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions class="base-select__options">
          <ListboxOption
            v-for="option in props.options"
            :key="option.id"
            v-slot="{ active, selected }"
            as="template"
            :value="option"
          >
            <li
              class="base-select__option"
              :class="{
                'base-select__option--active': active,
              }"
            >
              <span
                class="block truncate"
                :class="[selected ? 'font-semibold' : 'font-normal']"
              >
                {{ option.value !== '' ? option.value : 'select some shit' }}
              </span>

              <span
                v-if="selected"
                class="base-select__selected-icon"
                :class="[active ? 'text-white' : 'text-indigo-600']"
              >
                <CheckIcon
                  class="h-5 w-5"
                  aria-hidden="true"
                />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<style>
  .base-select__label {
    @apply block text-sm font-medium leading-6;

    @apply text-theme;
  }

  .base-select__selected-icon {
    @apply absolute inset-y-0 right-0 flex items-center pr-4;
  }

  .base-select__button {
    @apply bg-gray-100 dark:bg-gray-800 text-theme;
    @apply relative w-full cursor-default rounded-md  py-1.5 pl-3 pr-10 text-left;
    @apply shadow-sm ring-1 ring-gray-300 ring-inset sm:text-sm sm:leading-6;

    @apply focus:outline-none focus:ring-2;
    @apply focus:ring-teal-400 dark:focus:ring-sky-400;
  }

  .base-select__option {
    @apply relative cursor-default select-none py-2 pl-3 pr-9;
  }

  .base-select__option--active {
    @apply bg-gray-100 dark:bg-gray-500 text-theme;
  }

  .base-select__options {
    @apply absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md;
    @apply bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm focus:outline-none;
    @apply bg-gray-100 dark:bg-gray-800
  }
</style>
