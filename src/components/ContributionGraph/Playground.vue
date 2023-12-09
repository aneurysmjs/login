<script lang="ts" setup>
import { data } from './data'
import type { CalendarItem } from './heatmap'

// type Orientation = 'horizontal' | 'vertical'

const values = data
const endDate = new Date('2021-08-01')
const picked = 'Dings'
// const orientation: Orientation = 'horizontal'

const isVertical = false

function handleDayClick(calendar: CalendarItem) {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(calendar, null, 2))
}
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
      @day-click="handleDayClick"
    />
  </div>
</template>

<style>
  .calendar-heatmap-view {
    @apply flex justify-center flex-col;
  }
</style>
