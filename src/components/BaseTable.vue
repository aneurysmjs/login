<script lang="ts" setup>
import {
  FlexRender,
  type Table,
} from '@tanstack/vue-table'

interface BaseTableProps {
  table: Table<any>
  fullWidth?: boolean
  stripped?: boolean
}

const { table, fullWidth = false, stripped = false } = defineProps<BaseTableProps>()
</script>

<template>
  <table
    class="base-table"
    :class="{
      'base-table--full-width': fullWidth,
    }"
  >
    <thead>
      <tr
        v-for="headerGroup in table.getHeaderGroups()"
        :key="headerGroup.id"
      >
        <th
          v-for="header in headerGroup.headers"
          :key="header.id"
          :colSpan="header.colSpan"
          scope="col"
          class="base-table__th"
          :class="[]"
        >
          <FlexRender
            v-if="!header.isPlaceholder"
            :render="header.column.columnDef.header"
            :props="header.getContext()"
          />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in table.getRowModel().rows" :key="row.id" :class="{
          'base-table--stripped': stripped,
        }"
      >
        <td
          v-for="cell in row.getVisibleCells()"
          :key="cell.id"
          class="base-table__td"
        >
          <FlexRender
            :render="cell.column.columnDef.cell"
            :props="cell.getContext()"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style>
.base-table {
  @appy min-w-full divide-y divide-gray-700 dark:divide-gray-2;
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
  @apply px-3 py-3.5 text-left text-sm font-semibold text-white;
}

.base-table__td {
  @apply whitespace-nowrap px-3 py-4 text-sm text-theme;
}
</style>
