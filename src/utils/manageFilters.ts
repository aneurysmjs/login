import { type Ref } from 'vue'
import { type ColumnFilter } from '@tanstack/vue-table'

interface ManageFiltersOptions {
  id: string
  value: string
  columnFilters: Ref<ColumnFilter[]>
  resetValue?: string
}

export default function manageFilters({
  id,
  value,
  columnFilters,
  resetValue = '',
}: ManageFiltersOptions) {
  if (value === resetValue) {
    // this WON'T trigger any updates
    // columnFilters.value.filter(item => item.id !== id)

    // this does:
    columnFilters.value = columnFilters.value.filter(item => item.id !== id)
  }

  else {
    const idx = columnFilters.value.findIndex(filter => filter.id === id)

    if (idx >= 0) {
      // this WON'T trigger any updates
      // columnFilters.value[idx] = {
      //   id,
      //   value
      // }

      // this does:
      columnFilters.value = [
        ...columnFilters.value.slice(0, idx),
        {
          id,
          value,
        },
        ...columnFilters.value.slice(idx + 1),
      ]
    }
    else {
      // this WON'T trigger any updates
      // columnFilters.value.push({
      //   id: 'status',
      //   value,
      // })

      // this does:
      columnFilters.value = [
        ...columnFilters.value,
        {
          id,
          value,
        },
      ]
    }
  }
}
