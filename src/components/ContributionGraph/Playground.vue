<script lang="ts" setup>
import { data } from './data'

// type Orientation = 'horizontal' | 'vertical'

const values = data
const endDate = new Date('2021-08-01')
const picked = 'Dings'
// const orientation: Orientation = 'horizontal'

const isVertical = false
</script>

<template>
  <div class="calendar-heatmap-view">
    <VueCalendarHeatmap
      :values="values"
      :end-date="endDate"
      :style="{
        'max-width': isVertical ? '145px' : '675px',
      }"
      no-data-text="NIX"
      :tooltip-unit="picked"
      :vertical="isVertical"
    />
  </div>
</template>

<style>
  .calendar-heatmap-view {
    @apply flex justify-center flex-col;
  }
</style>
