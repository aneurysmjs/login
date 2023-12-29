<script lang="ts" setup generic="T">
import {
  FlexRender,
  type Table,
} from '@tanstack/vue-table'
import useTableUtils from '~/composables/useTableUtils'

interface BaseTableProps {
  columnSizing?: boolean
  fullWidth?: boolean
  stripped?: boolean
  table: Table<T>
}

const {
  table,
  fullWidth = false,
  stripped = false,
  columnSizing = false,
} = defineProps<BaseTableProps>()

const { getTableWidth } = useTableUtils()
</script>

<template>
  <div class="base-table__wrapper">
    <table
      class="base-table"
      :class="{
        'base-table--full-width': fullWidth,
        'base-table--fixed': columnSizing,
      }"
      :style="getTableWidth<T>(table)"
    >
      <thead class="base-table__thead">
        <slot
          name="tableHeader"
          :cells="table.getHeaderGroups().map(hG => hG.headers).flat()"
        >
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <BaseTableHeaderCell
              v-for="header in headerGroup.headers"
              :key="header.id"
              :header="header"
            />
          </tr>
        </slot>
      </thead>
      <tbody>
        <slot>
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :class="{
              'base-table--stripped': stripped,
            }"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="base-table__td"
              :style=" {
                width: `${cell.column.getSize()}px`,
              }"
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </td>
          </tr>
        </slot>
      </tbody>
    </table>
  </div>
</template>

<style>
.base-table {
  @apply  divide-y divide-gray-700 dark:divide-gray-2 ;
}

.base-table--fixed {
  @apply table-fixed;
}

.base-table__thead {
  @apply bg-gray-50 dark:bg-gray-700;
}

.base-table--stripped {
  @apply even:bg-gray-100 dark:even:bg-gray-800
}

.base-table--full-width {
  @apply w-full;
}

.base-table__sticky-header {
  @apply sticky top-0 z-10;
}

.base-table__th {
  @apply px-3 py-3.5 text-left text-sm font-semibold text-theme;
}

.base-table__td {
  @apply whitespace-nowrap px-3 py-4 text-sm text-theme;
}
</style>
