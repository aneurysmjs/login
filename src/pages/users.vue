<script setup lang="ts">
import { onMounted, ref } from 'vue'

import useUserQueries from '~/composables/useUserQueries'
import useDebounce from '~/composables/useDebounce'
import useUserTables from '~/composables/useUsersTable'

const { getUsers } = useUserQueries()

const enabled = ref(false)
const { data: users } = getUsers(enabled)

const statuses = [
  { id: 0, value: 'Select status' },
  { id: 1, value: 'Active' },
  { id: 2, value: 'Inactive' },
]

function rerender() {
  // data.value = defaultData
}

const searchValue = ref('')

const {
  table,
  handlerFilterStatus,
  handleFilterFirstName,
} = useUserTables(users)

const debouncedHandler = useDebounce(handleFilterFirstName)

// cancel any pending executions
onBeforeUnmount(() => {
  debouncedHandler.cancel()
})

onMounted(() => {
  enabled.value = true
})
</script>

<template>
  <div class="users">
    <div class="users__filters">
      <input
        v-model="searchValue"
        type="text"
        class="search-input"
        placeholder="Search name"
        @input="debouncedHandler"
      >

      <BaseSelect
        class="w-60"
        :options="statuses"
        @update:model-value="handlerFilterStatus"
      />
    </div>
    <BaseTable
      stripped
      :table="table"
      column-sizing
    />
    <div class="h-4" />
    <button
      class="border p-2"
      @click="rerender"
    >
      Rerender
    </button>
  </div>
  <pre>{{ JSON.stringify(table.getState().columnFilters, null, 2) }}</pre>
</template>

<style>
.users {
  @apply w-2/3;
  margin: 0 auto;
}

.search-input {
  @apply base-input max-w-60 mr-4;
}

.users__filters {
  @apply flex items-center mb-8;
}
</style>
