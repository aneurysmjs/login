import {
  type ColumnFiltersState,
  type FilterFn,
  type Updater,
  type VisibilityState,
  createColumnHelper,
  filterFns,
  getCoreRowModel,
  getFilteredRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { type Ref, ref } from 'vue'

import type { Person } from '~/composables/useUserQueries'

import manageFilters from '~/utils/manageFilters'
import { autoRemoveWhen } from '~/utils/tableUtils'

const columnHelper = createColumnHelper<Person>()

const filterStatus: FilterFn<Person> = filterFns.equals

filterStatus.autoRemove = autoRemoveWhen<Person>('Select status')

const columnFilters = ref<ColumnFiltersState>([])

// declare module '@tanstack/table-core' {
//   interface FilterFns {
//     filterStatus: FilterFn<Person>
//   }
// }

export default function useUserTables(users: Ref<Person[]> | Ref<undefined>) {
  const columns = [
    columnHelper.accessor('firstName', {
      cell: info => info.getValue(),
      enableColumnFilter: true,
      filterFn: 'includesString',
      // size: 100,
      minSize: 100,
    }),
    columnHelper.accessor(row => row.lastName, {
      cell: info => info.getValue(),
      header: () => 'Last Name',
      id: 'lastName',
      minSize: 100,
    }),
    columnHelper.accessor('age', {
      header: () => 'Age',
    }),
    columnHelper.accessor('visits', {
      header: () => 'Visits',
    }),
    columnHelper.accessor('status', {
      enableColumnFilter: true,
      // filterFn: 'equals',
      filterFn: filterStatus,
      header: 'Status',
    }),
    columnHelper.accessor('progress', {
      enableColumnFilter: true,
      filterFn: 'equals',

      header: 'Profile Progress',
    }),
  ]

  const statuses = [
    { id: 0, value: 'Select status' },
    { id: 1, value: 'Active' },
    { id: 2, value: 'Inactive' },
  ]

  const emptyArray = ref([])

  function handlerFilterStatus({ value }: { id: string, value: string }) {
    const id = 'status'

    manageFilters({ columnFilters, id, resetValue: statuses[0].value, value })
  }

  function handleFilterFirstName(evt: Event) {
    const id = 'firstName'
    const { value } = evt.target as HTMLInputElement

    manageFilters({ columnFilters, id, value })
  }

  function handleColumnFiltersChange(updaterOrValue: Updater<ColumnFiltersState>) {
    // console.log('updaterOrValue', updaterOrValue)

    const filtersTableState = typeof updaterOrValue === 'function'
      ? updaterOrValue(columnFilters.value)
      : updaterOrValue

    columnFilters.value = filtersTableState

    return filtersTableState
  }

  const columnVisibility = ref<VisibilityState>({
    visits: false,
  })

  const table = useVueTable({
    columnResizeMode: 'onChange',
    columns,
    get data() {
      return users?.value || emptyArray.value
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: handleColumnFiltersChange,
    // filterFns: {
    //   filterStatus,
    // },
    state: {
      get columnFilters() {
        return columnFilters.value
      },
      get columnVisibility() {
        return columnVisibility.value
      },
    },
  })

  return {
    handleFilterFirstName,
    handlerFilterStatus,
    table,
  }
}
