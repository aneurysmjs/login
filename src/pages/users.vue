<script setup lang="ts">
import { onMounted, ref } from 'vue'

import useUserQueries from '~/composables/useUserQueries'
import useDebounce from '~/composables/useDebounce'
import useUserTables from '~/composables/useUsersTable'

import { manageTableFilters } from '~/utils/tableUtils'

const { getUsers } = useUserQueries()

const enabled = ref(false)
const { data: users } = getUsers(enabled)

const statuses = [
  { id: 'status', value: 'Select status' },
  { id: 'status', value: 'Active' },
  { id: 'status', value: 'Inactive' },
]

const profileProgress = [
  { id: 'progress', value: 'Select progress' },
  { id: 'progress', value: '0.8' },
  { id: 'progress', value: '0.5' },
]

const searchValue = ref('')

const {
  table,
  // handlerFilterStatus,
  handleFilterFirstName,
} = useUserTables(users)

const debouncedHandler = useDebounce(handleFilterFirstName)

// function columnFiltersUpdater(obj: { id: string; value: string }) {
//   const updater: Updater<ColumnFiltersState> = (prev) => {
//     return [{
//       id: obj.id,
//       value:
//     }]
//   }

//   return updater
// }

function handleFilterProgress(obj: { id: string, value: string }) {
  table.setColumnFilters((prev) => {
    const progressValue = Number.parseFloat(obj.value)

    const columnFilter = {
      id: obj.id,
      value: Number.isNaN(progressValue) ? profileProgress[0].value : progressValue,
    }

    return manageTableFilters(prev, columnFilter, item => item.value === profileProgress[0].value)
  })
}

function handlerFilterStatus(obj: { id: string, value: string }) {
  table.setColumnFilters((prev) => {
    return manageTableFilters(prev, obj)
  })
}

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

      <BaseSelect
        class="w-60"
        :options="profileProgress"
        @update:model-value="handleFilterProgress"
      />
    </div>
    <BaseTable
      stripped
      :table="table"
      column-sizing
    >
      <template #tableHeader="{ cells }">
        <BaseTableHeaderCell
          v-for="header in cells"
          :key="header.id"
          :header="header"
        />
      </template>
    </BaseTable>

    <div class="h-4" />
    <button class="border p-2">
      Rerender
    </button>
  </div>
  <pre>{{ JSON.stringify(table.getState(), null, 2) }}</pre>
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
