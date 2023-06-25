<script setup lang="ts">
import type { ColumnFiltersState, FilterFn } from '@tanstack/vue-table'
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { computed, onMounted, ref } from 'vue'

import type { Person } from '../composables/useUserQueries'
import useUserQueries from '../composables/useUserQueries'
import useDebounce from '../composables/useDebounce'
import manageFilters from '~/utils/manageFilters'

const { getUsers } = useUserQueries()

const enabled = ref(false)
const { data: users } = getUsers(enabled)
const shouldTrigger = computed(() => users.value && enabled.value)

const columnHelper = createColumnHelper<Person>()

const statuses = [
  { id: 0, value: 'Select status' },
  { id: 1, value: 'Active' },
  { id: 2, value: 'Inactive' },
]

const filterStatus: FilterFn<Person> = (row, columnId, value) => {
  return row.getValue(columnId) === value
}

const columns = [
  columnHelper.accessor('firstName', {
    cell: info => info.getValue(),

    enableColumnFilter: true,
    filterFn: 'includesString',
  }),
  columnHelper.accessor(row => row.lastName, {
    id: 'lastName',
    cell: info => info.getValue(),
    header: () => 'Last Name',
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableColumnFilter: true,
    filterFn: filterStatus,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
  }),
]

const data = computed(() => users.value || [])

function rerender() {
  // data.value = defaultData
}

const searchValue = ref('')

const columnFilters = ref<ColumnFiltersState>([])

declare module '@tanstack/table-core' {
  interface FilterFns {
    filterStatus: FilterFn<Person>
  }
}

const table = useVueTable({
  get data() {
    return data.value
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  filterFns: {
    filterStatus,
  },
  state: {
    get columnFilters() {
      return columnFilters.value
    },
  },
})

function handlerFilterStatus({ value }: { id: string; value: string }) {
  const id = 'status'

  manageFilters({ id, value, columnFilters, resetValue: statuses[0].value })
}

function handleFilterFirstName(evt: Event) {
  const id = 'firstName'
  const { value } = evt.target as HTMLInputElement

  manageFilters({ id, value, columnFilters })
}

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
  <div class="p-2">
    <div class="users__filters">
      <input
        v-model="searchValue"
        type="text"
        class="search-input"
        placeholder="Search name"
        @input="debouncedHandler"
      >

      <BaseSelect class="w-60" :options="statuses" @update:model-value="handlerFilterStatus" />
    </div>
    <BaseTable full-width stripped :table="table" />
    <div class="h-4" />
    <button class="border p-2" @click="rerender">
      Rerender
    </button>
  </div>
  <pre>{{ JSON.stringify(table.getState().columnFilters, null, 2) }}</pre>
</template>

<style>
.search-input {
  @apply base-input max-w-60 mr-4;
}

.users__filters {
  @apply flex items-center mb-8;
}
</style>
