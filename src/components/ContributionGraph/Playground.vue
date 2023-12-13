<script lang="ts" setup>
import { data } from './data'
import type { CalendarItem } from './heatmap'

// type Orientation = 'horizontal' | 'vertical'

const values = data
const endDate = new Date('2021-08-01')
const picked = 'data'
// const orientation: Orientation = 'horizontal'

const isVertical = false

function handleDayClick(calendar: CalendarItem) {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(calendar, null, 2))
}

const dummyData = [
  {
    date: '2023-11-30T20:00:00Z',
    count: 635000,
  },
  {
    date: '2023-11-29T19:00:00Z',
    count: 50000,
  },
  {
    date: '2023-12-10T20:30:00Z',
    count: 1000,
  },
]

const range = [
  // '#0E4329',
  '#0e4429',
  '#0F6D32',
  '#0F6D32',
  '#26A641',
  '#38D352',
  '#38D352',
]
</script>

<template>
  <div class="play-ground">
    <!-- <VueCalendarHeatmapORIGINAL
      class="mx-auto"
      :values="values"
      :end-date="endDate"
      :style="{
        'max-width': isVertical ? '145px' : '675px',
      }"
      no-data-text="NIX"
      :tooltip-unit="picked"
      :vertical="isVertical"
    /> -->
    <h2 class="text-center">
      mine
    </h2>
    <VueCalendarHeatmap
      class="mx-auto"
      :values="values"
      :end-date="endDate"
      :style="{
        'max-width': isVertical ? '145px' : '675px',
      }"
      :tooltip-unit="picked"
      :vertical="isVertical"
      :range-color-value="range"
      @day-click="handleDayClick"
    />
    <!-- <VueCalendarHeatmap
      class="mx-auto"
      :values="dummyData"
      :end-date="new Date('2023-12-10')"
      :style="{
        'max-width': isVertical ? '145px' : '675px',
      }"

      :tooltip-unit="picked"
      :vertical="isVertical"
      @day-click="handleDayClick"
    /> -->

    <GithubContributionGraph
      :values="dummyData"
      :end-date="new Date('2023-12-10')"
      :range-color-value="range"
    />
  </div>
</template>

<style>
  /* .play-ground {
    @apply flex justify-center flex-col;
  } */
</style>
