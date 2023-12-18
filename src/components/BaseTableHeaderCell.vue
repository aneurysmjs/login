<script lang="ts" setup generic="T">
import {
  FlexRender,
  type Header,
} from '@tanstack/vue-table'

interface BaseTableHeaderCellProps {
  columnSizing?: boolean
  fullWidth?: boolean
  header: Header<T, unknown>
  stripped?: boolean
}

const {
  header,
} = defineProps<BaseTableHeaderCellProps>()
</script>

<template>
  <th
    :class="[]"
    :colSpan="header.colSpan"
    :style="{
      width: `${header.getSize()}px`,
    }"
    class="base-table__th relative"
    scope="col"
  >
    <FlexRender
      v-if="!header.isPlaceholder"
      :props="header.getContext()"
      :render="header.column.columnDef.header"
    />
    <ResizeHandle
      v-if="header.column.getCanResize()"
      :header="header"
    />
  </th>
</template>

<style>
.base-table__th {
  @apply px-3 py-3.5 text-left text-sm font-semibold text-theme;
}
</style>
