<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import type { CreateSingletonInstance, Instance } from 'tippy.js'
import tippy, { createSingleton } from 'tippy.js'
import {
  type CalendarItem,
  DAYS_IN_WEEK,
  DEFAULT_LOCALE,
  DEFAULT_RANGE_COLOR_DARK,
  DEFAULT_RANGE_COLOR_LIGHT,
  DEFAULT_SQUARE_SIZE,
  DEFAULT_TOOLTIP_UNIT,
  type HeatmapValue,
  type Locale,
  type Month,
  type TooltipFormatter,
  createHeatmap,
} from './heatmapUtils'

import 'tippy.js/dist/tippy.css'
import 'tippy.js/dist/svg-arrow.css'

interface VueCalendarHeatmap {
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
  vertical = false,
  noDataText = null,
  round = 0,
  darkMode = false,
  endDate,
  values,
  max,
  tooltipFormatter,
  //
  rangeColorValue,
  locale,
} = defineProps<VueCalendarHeatmap>()

const emit = defineEmits<{
  (evt: 'dayClick', value: CalendarItem): void
}>()

const SQUARE_BORDER_SIZE = DEFAULT_SQUARE_SIZE / 5
const SQUARE_SIZE = DEFAULT_SQUARE_SIZE + SQUARE_BORDER_SIZE
const LEFT_SECTION_WIDTH = Math.ceil(DEFAULT_SQUARE_SIZE * 2.5)
const RIGHT_SECTION_WIDTH = SQUARE_SIZE * 3
const TOP_SECTION_HEIGHT = DEFAULT_SQUARE_SIZE + DEFAULT_SQUARE_SIZE / 2
const BOTTOM_SECTION_HEIGHT = DEFAULT_SQUARE_SIZE + DEFAULT_SQUARE_SIZE / 2
const yearWrapperTransform = `translate(${LEFT_SECTION_WIDTH}, ${TOP_SECTION_HEIGHT})`

const svgRef = ref<null | SVGElement>(null)
const now = ref(new Date())
const heatmap = ref(createHeatmap(endDate, values, max))

const width = ref(0)
const height = ref(0)
const viewbox = ref('0 0 0 0')
const legendViewbox = ref('0 0 0 0')
const daysLabelWrapperTransform = ref('')
const monthsLabelWrapperTransform = ref('')
const legendWrapperTransform = ref('')
const lo = ref<Locale>({} as any)
const rangeColor = (rangeColorValue || (darkMode ? DEFAULT_RANGE_COLOR_DARK : DEFAULT_RANGE_COLOR_LIGHT))

const tippyInstances = new Map<HTMLElement, Instance>()

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
  if (tooltip) {
    if (day.count !== undefined) {
      if (tooltipFormatter) {
        return tooltipFormatter(day, tooltipUnit!)
      }

      return `<b>${day.count} ${tooltipUnit}</b> ${lo.value.on} ${
        lo.value.months[day.date.getMonth()]
      } ${day.date.getDate()}, ${day.date.getFullYear()}`
    } else if (noDataText) {
      return `${noDataText}`
    } else if (noDataText !== false) {
      return `<b>No ${tooltipUnit}</b> ${lo.value.on} ${
        lo.value.months[day.date.getMonth()]
      } ${day.date.getDate()}, ${day.date.getFullYear()}`
    }
  }
  return undefined
}

function getWeekPosition(index: number) {
  if (vertical) {
    return `translate(0, ${SQUARE_SIZE * heatmap.value.weekCount - (index + 1) * SQUARE_SIZE})`
  }
  return `translate(${index * SQUARE_SIZE}, 0)`
}

function getDayPosition(index: number) {
  if (vertical) {
    return `translate(${index * SQUARE_SIZE}, 0)`
  }
  return `translate(0, ${index * SQUARE_SIZE})`
}

function getMonthLabelPosition(month: Month) {
  if (vertical) {
    return {
      x: 3,
      y: SQUARE_SIZE * heatmap.value.weekCount - SQUARE_SIZE * month.index - SQUARE_SIZE / 4,
    }
  }
  return {
    x: SQUARE_SIZE * month.index,
    y: SQUARE_SIZE - SQUARE_BORDER_SIZE,
  }
}

// watch([toRef(props, 'rangeColor'), toRef(props, 'darkMode')], ([rc, dm]) => {
//   rangeColor.value = rc || (dm ? Heatmap.DEFAULT_RANGE_COLOR_DARK : Heatmap.DEFAULT_RANGE_COLOR_LIGHT)
// })

// watch([rangeColor, darkMode], ([rc, dm]) => {
//   rangeColor.value = rc || (dm ? Heatmap.DEFAULT_RANGE_COLOR_DARK : Heatmap.DEFAULT_RANGE_COLOR_LIGHT)
// })

watch(
  () => vertical,
  (v) => {
    if (v) {
      width.value = LEFT_SECTION_WIDTH + SQUARE_SIZE * DAYS_IN_WEEK + RIGHT_SECTION_WIDTH
      height.value = TOP_SECTION_HEIGHT + SQUARE_SIZE * heatmap.value.weekCount + SQUARE_BORDER_SIZE
      daysLabelWrapperTransform.value = `translate(${LEFT_SECTION_WIDTH}, 0)`
      monthsLabelWrapperTransform.value = `translate(0, ${TOP_SECTION_HEIGHT})`
    } else {
      width.value = LEFT_SECTION_WIDTH + SQUARE_SIZE * heatmap.value.weekCount + SQUARE_BORDER_SIZE
      height.value = TOP_SECTION_HEIGHT + SQUARE_SIZE * DAYS_IN_WEEK
      daysLabelWrapperTransform.value = `translate(0, ${TOP_SECTION_HEIGHT})`
      monthsLabelWrapperTransform.value = `translate(${LEFT_SECTION_WIDTH}, 0)`
    }
  },
  { immediate: true },
)

watch(
  [width, height],
  ([w, h]) => {
    viewbox.value = ` 0 0 ${w} ${h}`
  },
  { immediate: true },
)

watch(
  [width, height, () => rangeColor],
  ([w, h, rc]) => {
    legendWrapperTransform.value = vertical
      ? `translate(${LEFT_SECTION_WIDTH + SQUARE_SIZE * DAYS_IN_WEEK}, ${TOP_SECTION_HEIGHT})`
      : `translate(${w - SQUARE_SIZE * rc.length - 30}, ${h - BOTTOM_SECTION_HEIGHT})`
  },
  { immediate: true },
)

watch(
  () => locale,
  (l) => {
    lo.value = l ? { ...DEFAULT_LOCALE, ...l } : DEFAULT_LOCALE
  },
  { immediate: true },
)

watch(
  () => rangeColor,
  (rc) => {
    legendViewbox.value = `0 0 ${DEFAULT_SQUARE_SIZE * (rc.length + 1)} ${DEFAULT_SQUARE_SIZE}`
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

onMounted(initTippy)

onBeforeUnmount(() => {
  tippySingleton?.destroy()
  tippyInstances.forEach(item => item.destroy())
})

function initTippyLazy(evt: MouseEvent) {
  if (
    tippySingleton
    && evt.target
    && (evt.target as HTMLElement).classList.contains('vch__day__square')
    && (evt.target as HTMLElement).dataset.weekIndex !== undefined
    && (evt.target as HTMLElement).dataset.dayIndex !== undefined
  ) {
    const weekIndex = Number((evt.target as HTMLElement).dataset.weekIndex)
    const dayIndex = Number((evt.target as HTMLElement).dataset.dayIndex)

    if (!Number.isNaN(weekIndex) && !Number.isNaN(dayIndex)) {
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
  <div
    class="vch__container"
    :class="{ 'dark-mode': darkMode }"
  >
    <svg
      ref="svgRef"
      class="vch__wrapper"
      :viewBox="viewbox"
    >
      <g
        class="vch__months__labels__wrapper"
        :transform="monthsLabelWrapperTransform"
      >
        <text
          v-for="(month, index) in heatmap.getFirstFullWeekOfMonths()"
          :key="index"
          class="vch__month__label"
          :x="getMonthLabelPosition(month).x"
          :y="getMonthLabelPosition(month).y"
        >
          {{ lo.months[ month.value ] }}
        </text>
      </g>

      <g
        class="vch__days__labels__wrapper"
        :transform="daysLabelWrapperTransform"
      >
        <text
          class="vch__day__label"
          :x="vertical ? SQUARE_SIZE : 0"
          :y="vertical ? SQUARE_SIZE - SQUARE_BORDER_SIZE : 20"
        >
          {{ lo.days[ 1 ] }}
        </text>
        <text
          class="vch__day__label"
          :x="vertical ? SQUARE_SIZE * 3 : 0"
          :y="vertical ? SQUARE_SIZE - SQUARE_BORDER_SIZE : 44"
        >
          {{ lo.days[ 3 ] }}
        </text>
        <text
          class="vch__day__label"
          :x="vertical ? SQUARE_SIZE * 5 : 0"
          :y="vertical ? SQUARE_SIZE - SQUARE_BORDER_SIZE : 69"
        >
          {{ lo.days[ 5 ] }}
        </text>
      </g>

      <g
        v-if="vertical"
        class="vch__legend__wrapper"
        :transform="legendWrapperTransform"
      >
        <text
          :x="SQUARE_SIZE * 1.25"
          y="8"
        >
          {{ lo.less }}
        </text>
        <rect
          v-for="(color, index) in rangeColor"
          :key="index"
          :rx="round"
          :ry="round"
          :style="{ fill: color }"
          :width="SQUARE_SIZE - SQUARE_BORDER_SIZE"
          :height="SQUARE_SIZE - SQUARE_BORDER_SIZE"
          :x="SQUARE_SIZE * 1.75"
          :y="SQUARE_SIZE * (index + 1)"
        />
        <text
          :x="SQUARE_SIZE * 1.25"
          :y="SQUARE_SIZE * (rangeColor.length + 2) - SQUARE_BORDER_SIZE"
        >
          {{ lo.more }}
        </text>
      </g>

      <g
        class="vch__year__wrapper"
        :transform="yearWrapperTransform"
        @mouseover="initTippyLazy"
      >
        <g
          v-for="(week, weekIndex) in heatmap.getCalendar()"
          :key="weekIndex"
          class="vch__month__wrapper"
          :transform="getWeekPosition(weekIndex)"
        >
          <template
            v-for="(day, dayIndex) in week"
            :key="dayIndex"
          >
            <rect
              v-if="day.date < now"
              class="vch__day__square"
              :rx="round"
              :ry="round"
              :transform="getDayPosition(dayIndex)"
              :width="SQUARE_SIZE - SQUARE_BORDER_SIZE"
              :height="SQUARE_SIZE - SQUARE_BORDER_SIZE"
              :style="{ fill: rangeColor[day.colorIndex] }"
              :data-week-index="weekIndex"
              :data-day-index="dayIndex"
              :data-date="day.date"
              @click="emit('dayClick', day)"
            />
          </template>
        </g>
      </g>
    </svg>
    <div class="vch__legend">
      <slot name="legend">
        <div class="vch__legend-left">
          <slot name="vch__legend-left" />
        </div>
        <div class="vch__legend-right">
          <slot name="legend-right">
            <div class="vch__legend">
              <div>{{ lo.less }}</div>
              <svg
                v-if="!vertical"
                class="vch__external-legend-wrapper"
                :viewBox="legendViewbox"
                :height="SQUARE_SIZE - SQUARE_BORDER_SIZE"
              >
                <g class="vch__legend__wrapper">
                  <rect
                    v-for="(color, index) in rangeColor"
                    :key="index"
                    :rx="round"
                    :ry="round"
                    :style="{ fill: color }"
                    :width="SQUARE_SIZE - SQUARE_BORDER_SIZE"
                    :height="SQUARE_SIZE - SQUARE_BORDER_SIZE"
                    :x="SQUARE_SIZE * index"
                  />
                </g>
              </svg>
              <div>{{ lo.more }}</div>
            </div>
          </slot>
        </div>
      </slot>
    </div>
  </div>
</template>

<style>
.vch__container {
  position: static;
}

.vch__legend {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vch__external-legend-wrapper {
  margin: 0 8px;
}

svg.vch__wrapper {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 10px;
  width: 100%;
}

.vch__months__labels__wrapper text.vch__month__label {
  font-size: 10px;
}

.vch__days__labels__wrapper text.vch__day__label,
.vch__legend__wrapper text {
  font-size: 9px;
}

text.vch__month__label,
text.vch__day__label,
.vch__legend__wrapper text {
  fill: #767676;
}

rect.vch__day__square:hover {
  stroke: #555;
  stroke-width: 2px;
  paint-order: stroke;
}

rect.vch__day__square:focus {
  outline: none;
}

svg.vch__wrapper.dark-mode text.vch__month__label,
svg.vch__wrapper.dark-mode text.vch__day__label,
svg.vch__wrapper.dark-mode .vch__legend__wrapper text {
  fill: #fff;
}
</style>
