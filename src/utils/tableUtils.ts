import type {
  ColumnFilter,
  ColumnFilterAutoRemoveTestFn,
  ColumnFiltersState,
} from '@tanstack/vue-table'

export function autoRemoveWhen<T>(value: any) {
  const autoRemove: ColumnFilterAutoRemoveTestFn<T> = (filterValue) => {
    return filterValue === value
  }

  return autoRemove
}

export function manageTableFilters(arr: ColumnFiltersState, newItem: ColumnFilter, shouldRemove?: (item: ColumnFilter) => boolean): ColumnFiltersState {
  // Check if an item with the same ID already exists in the array
  const existingItemIndex = arr.findIndex(item => item.id === newItem.id)

  if (newItem.value === '' || (shouldRemove && shouldRemove(newItem))) {
    // Remove the item if its value is an empty string or the custom removal condition is met
    if (existingItemIndex !== -1) {
      arr.splice(existingItemIndex, 1)
    }
  } else if (existingItemIndex !== -1) {
    // Update the item if it already exists with a different value
    if (arr[existingItemIndex].value !== newItem.value) {
      arr[existingItemIndex].value = newItem.value
    }
  } else {
    // Add the item if it doesn't exist in the array
    arr.push(newItem)
  }

  return arr
}
