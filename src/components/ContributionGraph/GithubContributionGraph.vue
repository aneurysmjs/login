<script lang="ts" setup>
import { nextTick, onMounted, ref, watch } from 'vue'

import type { CreateSingletonInstance, Instance } from 'tippy.js'
import tippy, { createSingleton } from 'tippy.js'
import {
  type CalendarItem,
  DEFAULT_LOCALE,
  DEFAULT_RANGE_COLOR_DARK,
  DEFAULT_RANGE_COLOR_LIGHT,
  DEFAULT_TOOLTIP_UNIT,
  type HeatmapValue,
  type Locale,
  type TooltipFormatter,
  createHeatmap,
} from './heatmapUtils'

import 'tippy.js/dist/tippy.css'
import 'tippy.js/dist/svg-arrow.css'

interface GithubContributionGraphProps {
  darkMode?: boolean
  /**
   * Can be a date parseable string, a millisecond timestamp, or a Date object.
   * The calendar will start automatically one year before this date.
   */
  endDate: string | Date
  locale?: Partial<Locale>
  /**
   * Any number which should be the max color.
   */
  max?: number
  /**
   * Tooltip text to display on days without data. null by default (shows no tooltip at all).
   */
  noDataText?: boolean | string
  /**
   * Array of strings which represents the colors of the progression.
   *
   * The color at rangeColor[0] will always represent the values for a count: null
   * The color at rangeColor[1] will always represent the values for a count: 0
   * The others are automatically distributed over the maximum value of count, unless you specify `max` props.
   */
  rangeColorValue?: string[]
  /**
   * Number to create rounded corners or circles in heatmap.
   */
  round?: number
  /**
   * enable/disable tooltip on square hover. true by default.
   */
  tooltip?: boolean
  /**
   * A method to have full control about tooltip content.
   */
  tooltipFormatter?: TooltipFormatter
  /**
   * String representing heatmap's unit of measure. Value is "contributions" by default.
   */
  tooltipUnit?: string
  /**
   * Array of objects with date and count keys. date values can be a date parseable string, a millisecond timestamp,
   * or a Date object. count value should be a number.
   */
  values: HeatmapValue[]
  /**
   * switch to vertical mode. false by default.
   */
  vertical?: boolean
}

const {
  tooltip = true,
  tooltipUnit = DEFAULT_TOOLTIP_UNIT,
  // vertical = false,
  noDataText = null,
  // round = 0,
  darkMode = false,
  endDate,
  values,
  max,
  tooltipFormatter,
  //
  rangeColorValue,
  locale,
} = defineProps<GithubContributionGraphProps>()

const emit = defineEmits<{
  (evt: 'dayClick', value: CalendarItem): void
}>()

// const squaresRef = ref<HTMLDivElement | null>(null)
const now = ref(new Date())

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

// const endDate2 = new Date('2023-12-10')
const rangeColor = (rangeColorValue || (darkMode ? DEFAULT_RANGE_COLOR_DARK : DEFAULT_RANGE_COLOR_LIGHT))

const heatmap = ref(createHeatmap(endDate, dummyData))
const tippyInstances = new Map<HTMLElement, Instance>()
const localeMap = ref<Locale>({} as any)

let tippySingleton: CreateSingletonInstance

function initTippy() {
  tippyInstances.clear()

  if (tippySingleton) {
    tippySingleton.setInstances(Array.from(tippyInstances.values()))
  } else {
    tippySingleton = createSingleton(Array.from(tippyInstances.values()), {
      overrides: [],
      moveTransition: 'transform 0.1s ease-out',
      allowHTML: true,
    })
  }
}

function tooltipOptions(day: CalendarItem) {
  if (!tooltip) {
    return undefined
  }

  const { count, date } = day
  const { on, months } = localeMap.value
  const unitText = tooltipUnit ? ` ${tooltipUnit}` : ''

  return tooltipFormatter
    ? tooltipFormatter(day, tooltipUnit!)
    : `<b>${
        count !== undefined
          ? count + unitText
          : noDataText || `No ${tooltipUnit}`
      }</b> ${on} ${
        months[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`
}
watch(
  () => locale,
  (l) => {
    localeMap.value = l ? { ...DEFAULT_LOCALE, ...l } : DEFAULT_LOCALE
  },
  { immediate: true },
)

watch([
  () => values,
  () => tooltipUnit,
  () => tooltipFormatter,
  () => noDataText,
  () => max,
  () => rangeColor,
], () => {
  heatmap.value = createHeatmap(endDate, values, max)
  tippyInstances.forEach(item => item.destroy())
  nextTick(initTippy)
})

onMounted(() => {
  // if (squaresRef.value) {
  //   for (let i = 1; i < 365; i += 1) {
  //     const level = Math.floor(Math.random() * 3)
  //     squaresRef.value.insertAdjacentHTML('beforeend', `<li data-level="${level}"></li>`)
  //   }
  // }

  initTippy()
})

function isElementForTooltip(evt: MouseEvent) {
  return evt.target
    && (evt.target as HTMLElement).classList.contains('github-contribution-graph__square-item')
    && (evt.target as HTMLElement).dataset.weekIndex !== undefined
    && (evt.target as HTMLElement).dataset.dayIndex !== undefined
}

function handleMouseOverTippy(evt: MouseEvent) {
  if (tippySingleton && isElementForTooltip(evt)) {
    const weekIndex = Number((evt.target as HTMLElement).dataset.weekIndex)
    const dayIndex = Number((evt.target as HTMLElement).dataset.dayIndex)

    if (!Number.isNaN(weekIndex) && !Number.isNaN(dayIndex)) {
      /**
       * get the day from the calender
       */
      const tooltip = tooltipOptions(heatmap.value.getCalendar()[weekIndex][dayIndex])

      if (tooltip) {
        const instance = tippyInstances.get(evt.target as HTMLElement)

        if (instance) {
          instance.setContent(tooltip)
        } else if (!instance) {
          tippyInstances.set(evt.target as HTMLElement, tippy(evt.target as HTMLElement, { content: tooltip } as any))
          tippySingleton.setInstances(Array.from(tippyInstances.values()))
        }
      }
    }
  }
}
</script>

<template>
  <div class="github-contribution-graph">
    <ul class="github-contribution-graph__months github-contribution-graph__months--full">
      <li class="text-sm">
        Jan
      </li>
      <li class="text-sm">
        Feb
      </li>
      <li class="text-sm">
        Mar
      </li>
      <li class="text-sm">
        Apr
      </li>
      <li class="text-sm">
        May
      </li>
      <li class="text-sm">
        Jun
      </li>
      <li class="text-sm">
        Jul
      </li>
      <li class="text-sm">
        Aug
      </li>
      <li class="text-sm">
        Sep
      </li>
      <li class="text-sm">
        Oct
      </li>
      <li class="text-sm">
        Nov
      </li>
      <li class="text-sm">
        Dec
      </li>
    </ul>
    <ul class="github-contribution-graph__days">
      <li class="text-xs">
        Sun
      </li>
      <li class="text-xs">
        Mon
      </li>
      <li class="text-xs">
        Tue
      </li>
      <li class="text-xs">
        Wed
      </li>
      <li class="text-xs">
        Thu
      </li>
      <li class="text-xs">
        Fri
      </li>
      <li class="text-xs">
        Sat
      </li>
    </ul>
    <div
      class="github-contribution-graph__squares"
      :data-weeks="heatmap.weekCount"
      @mouseover="handleMouseOverTippy"
    >
      <template
        v-for="(day, dayIndex) in heatmap.getCalendar().flat()"
        :key="dayIndex"
      >
        <span
          v-if="day.date < now"
          :data-day-index="day.dayIndex"
          :data-week-index="day.weekIndex"
          :data-day="day.date"
          class="github-contribution-graph__square-item"
          data-level="${level}"
          :style="{
            background: rangeColor[day.colorIndex],
          }"
          @click="emit('dayClick', day)"
        />
        <!-- {{ rangeColor[day.colorIndex] }} -->
      </template>
    </div>
  </div>

  <!-- <pre>
    {{ JSON.stringify(heatmap.getCalendar(), null, 2) }}
  </pre> -->
</template>

<style>
/* Article - https://bitsofco.de/github-contribution-graph-css-grid/ */

/* Grid-related CSS */

:root {
  --square-size: 15px;
  --square-gap: 5px;
  --week-width: calc(var(--square-size) + var(--square-gap));

  --month-size: calc(var(--week-width) * 4);
}

.github-contribution-graph {
  @apply inline-grid gap-2.5;
  grid-template-areas: "empty months"
                       "days squares";
  grid-template-columns: auto 1fr;

  @apply border-1 border-solid border-gray-500

  @apply p-5 m-5;
}

.github-contribution-graph__months {
  @apply grid;
  grid-area: months;
}

.github-contribution-graph__months--full {
  grid-template-columns: repeat(12, var(--month-size));
}

.github-contribution-graph__months--semester {
  grid-template-columns: repeat(6, var(--month-size));
}

.github-contribution-graph__months--quarter {
  grid-template-columns: repeat(4, var(--month-size));
}

.github-contribution-graph__months--trimester {
  grid-template-columns: repeat(3, var(--month-size));
}

.github-contribution-graph__days {
  display: grid;
  gap: var(--square-gap);
  grid-template-rows: repeat(7, var(--square-size));
  grid-area: days;
}

.github-contribution-graph__days li:nth-child(odd) {
  @apply invisible;
}

.github-contribution-graph__squares {
  display: grid;
  gap: var(--square-gap);
  grid-template-rows: repeat(7, var(--square-size));

  grid-area: squares;
  grid-auto-flow: column;
  grid-template-columns: repeat(54, 1fr);
}

.github-contribution-graph__squares li {
  background-color: #ebedf0;
}

.github-contribution-graph__squares li[data-level="1"] {
  background-color: #c6e48b;
}

.github-contribution-graph__squares li[data-level="2"] {
  background-color: #7bc96f;
}

.github-contribution-graph__squares li[data-level="3"] {
  background-color: #196127;
}

.diagonalRising {
  background-color: #dd4f39;
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}
</style>
