import { type Ref, ref } from 'vue'
import {
  type ColumnFiltersState,
  type FilterFn,
  type Updater,
  createColumnHelper,
  filterFns,
  getCoreRowModel,
  getFilteredRowModel,
  useVueTable,
} from '@tanstack/vue-table'

import type { Person } from '~/composables/useUserQueries'
import { autoRemoveWhen } from '~/utils/tableUtils'
import manageFilters from '~/utils/manageFilters'

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
      id: 'lastName',
      cell: info => info.getValue(),
      header: () => 'Last Name',
      minSize: 100,
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
      // filterFn: 'equals',
      filterFn: filterStatus,
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
      filterFn: 'equals',

      enableColumnFilter: true,
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

    manageFilters({ id, value, columnFilters, resetValue: statuses[0].value })
  }

  function handleFilterFirstName(evt: Event) {
    const id = 'firstName'
    const { value } = evt.target as HTMLInputElement

    manageFilters({ id, value, columnFilters })
  }

  function handleColumnFiltersChange(updaterOrValue: Updater<ColumnFiltersState>) {
    // console.log('updaterOrValue', updaterOrValue)

    const filtersTableState = typeof updaterOrValue === 'function'
      ? updaterOrValue(columnFilters.value)
      : updaterOrValue

    columnFilters.value = filtersTableState

    return filtersTableState
  }

  const table = useVueTable({
    get data() {
      return users?.value || emptyArray.value
    },
    columns,
    columnResizeMode: 'onChange',
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
    },
  })

  return {
    table,
    handlerFilterStatus,
    handleFilterFirstName,
  }
}
