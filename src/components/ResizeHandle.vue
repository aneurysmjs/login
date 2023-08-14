<script setup lang="ts">
import { type Header, defaultColumnSizing } from '@tanstack/vue-table'

const { header } = defineProps<{
  header: Header<any, any>
}>()

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max)
}

function updateColumnSizeBy(header: Header<any, any>, delta: number) {
  header.getContext().table.setColumnSizing((prev) => {
    const {
      maxSize = defaultColumnSizing.maxSize,
      minSize = defaultColumnSizing.minSize,
    } = header.column.columnDef

    return {
      ...prev,
      [header.id]: clamp(header.column.getSize() + delta, minSize, maxSize),
    }
  })
}
</script>

<template>
  <div
    class="resize-handle"
    :class="{
      'is-resizing': header.column.getIsResizing(),
    }"
    role="separator"
    tabIndex="0"
    aria-label="Use arrow keys to resize"
    aria-orientation="vertical"
    @click.stop
    @mousedown="header.getResizeHandler()?.($event)"
    @dblclick="header.column.resetSize()"
    @keydown.left.prevent="updateColumnSizeBy(header, -10)"
    @keydown.right.prevent="updateColumnSizeBy(header, 10)"
    @keydown.esc="header.column.resetSize()"
  >
    <div class="resize-handle__inner" />
  </div>
</template>

<style scoped>
.resize-handle {
  @apply absolute z-3 select-none touch-none cursor-col-resize;
  @apply flex items-center justify-center;
  inset-inline-end: 0;
  inset-block: 0;
}

.resize-handle:focus {
  outline: none;
}

.resize-handle__inner {
  @apply w-1 h-50% bg-gray-500;

}

.resize-handle:is(:hover, .is-resizing) .resize-handle__inner {
  @apply bg-gray-500;
}

.resize-handle:focus-visible .resize-handle__inner {
  @apply bg-gray-400;
}
</style>
