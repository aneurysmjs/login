import type {
  Table,
} from '@tanstack/vue-table'

export default function useTableUtils() {
  function getTableWidth<T>(table: Table<T>) {
    return {
      width: `${table.getTotalSize()}px`,
    }
  }

  return {
    getTableWidth,
  }
}
