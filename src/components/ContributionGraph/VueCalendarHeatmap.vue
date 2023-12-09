<script lang="ts">
import type { PropType } from 'vue'
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  toRef,
  toRefs,
  watch,
} from 'vue'

import type { CreateSingletonInstance, Instance } from 'tippy.js'
import tippy, { createSingleton } from 'tippy.js'
import type { CalendarItem, Locale, Month, TooltipFormatter, Value } from './heatmap'
import { Heatmap } from './heatmap'

import 'tippy.js/dist/tippy.css'

import 'tippy.js/dist/svg-arrow.css'

//

// interface VueCalendarHeatmap {
//   endDate: string
//   max: number
//   rangeColor: string[]
//   values: Value[]
//   locale: Partial<Locale>
//   tooltip?: boolean
//   tooltipUnit?: string
//   vertical?: boolean
//   tooltipFormatter: TooltipFormatter
//   noDataText?: [boolean, string]
//   round?: number
//   darkMode?: boolean
// }

// const {
//   tooltip = true,
//   tooltipUnit = Heatmap.DEFAULT_TOOLTIP_UNIT,
//   vertical = false,
//   noDataText = null,
//   round = 0,
//   darkMode = false,
// } = defineProps<VueCalendarHeatmap>()

// const emit = defineEmits<{
//   (e: 'change', id: number): void
//   (e: 'update', value: string): void
// }>()

// emit('dayClick')

export default /* #__PURE__ */defineComponent({
  name: 'CalendarHeatmap',
  props: {
    endDate: {
      required: true,
    },
    max: {
      type: Number,
    },
    rangeColor: {
      type: Array as PropType<string[]>,
    },
    values: {
      type: Array as PropType<Value[]>,
      required: true,
    },
    locale: {
      type: Object as PropType<Partial<Locale>>,
    },
    tooltip: {
      type: Boolean,
      default: true,
    },
    tooltipUnit: {
      type: String,
      default: Heatmap.DEFAULT_TOOLTIP_UNIT,
    },
    tooltipFormatter: {
      type: Function as PropType<TooltipFormatter>,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    noDataText: {
      type: [Boolean, String],
      default: null,
    },
    round: {
      type: Number,
      default: 0,
    },
    darkMode: Boolean,
  },
  emits: ['dayClick'],
  setup(props) {
    const SQUARE_BORDER_SIZE = Heatmap.SQUARE_SIZE / 5
    const SQUARE_SIZE = Heatmap.SQUARE_SIZE + SQUARE_BORDER_SIZE
    const LEFT_SECTION_WIDTH = Math.ceil(Heatmap.SQUARE_SIZE * 2.5)
    const RIGHT_SECTION_WIDTH = SQUARE_SIZE * 3
    const TOP_SECTION_HEIGHT = Heatmap.SQUARE_SIZE + (Heatmap.SQUARE_SIZE / 2)
    const BOTTOM_SECTION_HEIGHT = Heatmap.SQUARE_SIZE + (Heatmap.SQUARE_SIZE / 2)
    const yearWrapperTransform = `translate(${LEFT_SECTION_WIDTH}, ${TOP_SECTION_HEIGHT})`

    const svg = ref<null | SVGElement>(null)
    const now = ref(new Date())
    const heatmap = ref(new Heatmap(props.endDate as Date, props.values, props.max))

    const width = ref(0)
    const height = ref(0)
    const viewbox = ref('0 0 0 0')
    const legendViewbox = ref('0 0 0 0')
    const daysLabelWrapperTransform = ref('')
    const monthsLabelWrapperTransform = ref('')
    const legendWrapperTransform = ref('')
    const lo = ref<Locale>({} as any)
    const rangeColor = ref<string[]>(props.rangeColor || (props.darkMode ? Heatmap.DEFAULT_RANGE_COLOR_DARK : Heatmap.DEFAULT_RANGE_COLOR_LIGHT))

    const {
      values,
      tooltipUnit,
      tooltipFormatter,
      noDataText,
      max,
      vertical,
      locale,
    } = toRefs(props)
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
      if (props.tooltip) {
        if (day.count !== undefined) {
          if (props.tooltipFormatter) {
            return props.tooltipFormatter(day, props.tooltipUnit!)
          }
          return `<b>${day.count} ${props.tooltipUnit}</b> ${lo.value.on} ${lo.value.months[day.date.getMonth()]} ${day.date.getDate()}, ${day.date.getFullYear()}`
        } else if (props.noDataText) {
          return `${props.noDataText}`
        } else if (props.noDataText !== false) {
          return `<b>No ${props.tooltipUnit}</b> ${lo.value.on} ${lo.value.months[day.date.getMonth()]} ${day.date.getDate()}, ${day.date.getFullYear()}`
        }
      }
      return undefined
    }

    function getWeekPosition(index: number) {
      if (props.vertical) {
        return `translate(0, ${(SQUARE_SIZE * heatmap.value.weekCount) - ((index + 1) * SQUARE_SIZE)})`
      }
      return `translate(${index * SQUARE_SIZE}, 0)`
    }

    function getDayPosition(index: number) {
      if (props.vertical) {
        return `translate(${index * SQUARE_SIZE}, 0)`
      }
      return `translate(0, ${index * SQUARE_SIZE})`
    }

    function getMonthLabelPosition(month: Month) {
      if (props.vertical) {
        return { x: 3, y: (SQUARE_SIZE * heatmap.value.weekCount) - (SQUARE_SIZE * (month.index)) - (SQUARE_SIZE / 4) }
      }
      return { x: SQUARE_SIZE * month.index, y: SQUARE_SIZE - SQUARE_BORDER_SIZE }
    }

    watch([toRef(props, 'rangeColor'), toRef(props, 'darkMode')], ([rc, dm]) => {
      rangeColor.value = rc || (dm ? Heatmap.DEFAULT_RANGE_COLOR_DARK : Heatmap.DEFAULT_RANGE_COLOR_LIGHT)
    })

    watch(vertical, (v) => {
      if (v) {
        width.value = LEFT_SECTION_WIDTH + (SQUARE_SIZE * Heatmap.DAYS_IN_WEEK) + RIGHT_SECTION_WIDTH
        height.value = TOP_SECTION_HEIGHT + (SQUARE_SIZE * heatmap.value.weekCount) + SQUARE_BORDER_SIZE
        daysLabelWrapperTransform.value = `translate(${LEFT_SECTION_WIDTH}, 0)`
        monthsLabelWrapperTransform.value = `translate(0, ${TOP_SECTION_HEIGHT})`
      } else {
        width.value = LEFT_SECTION_WIDTH + (SQUARE_SIZE * heatmap.value.weekCount) + SQUARE_BORDER_SIZE
        height.value = TOP_SECTION_HEIGHT + (SQUARE_SIZE * Heatmap.DAYS_IN_WEEK)
        daysLabelWrapperTransform.value = `translate(0, ${TOP_SECTION_HEIGHT})`
        monthsLabelWrapperTransform.value = `translate(${LEFT_SECTION_WIDTH}, 0)`
      }
    }, { immediate: true })

    watch([width, height], ([w, h]) => (viewbox.value = ` 0 0 ${w} ${h}`), { immediate: true })

    watch([width, height, rangeColor], ([w, h, rc]) => {
      legendWrapperTransform.value = vertical.value
        ? `translate(${LEFT_SECTION_WIDTH + (SQUARE_SIZE * Heatmap.DAYS_IN_WEEK)}, ${TOP_SECTION_HEIGHT})`
        : `translate(${w - (SQUARE_SIZE * rc.length) - 30}, ${h - BOTTOM_SECTION_HEIGHT})`
    }, { immediate: true })

    watch(locale, l => (lo.value = l ? { ...Heatmap.DEFAULT_LOCALE, ...l } : Heatmap.DEFAULT_LOCALE), { immediate: true })
    watch(rangeColor, rc => (legendViewbox.value = `0 0 ${Heatmap.SQUARE_SIZE * (rc.length + 1)} ${Heatmap.SQUARE_SIZE}`), { immediate: true })

    watch(
      [values, tooltipUnit, tooltipFormatter, noDataText, max, rangeColor],
      () => {
        heatmap.value = new Heatmap(props.endDate as Date, props.values, props.max)
        tippyInstances.forEach(item => item.destroy())
        nextTick(initTippy)
      },
    )

    onMounted(initTippy)

    onBeforeUnmount(() => {
      tippySingleton?.destroy()
      tippyInstances.forEach(item => item.destroy())
    })

    function initTippyLazy(e: MouseEvent) {
      if (tippySingleton
        && e.target
        && (e.target as HTMLElement).classList.contains('vch__day__square')
        && (e.target as HTMLElement).dataset.weekIndex !== undefined
        && (e.target as HTMLElement).dataset.dayIndex !== undefined
      ) {
        const weekIndex = Number((e.target as HTMLElement).dataset.weekIndex)
        const dayIndex = Number((e.target as HTMLElement).dataset.dayIndex)

        if (!Number.isNaN(weekIndex) && !Number.isNaN(dayIndex)) {
          const tooltip = tooltipOptions(heatmap.value.calendar[weekIndex][dayIndex])
          if (tooltip) {
            const instance = tippyInstances.get(e.target as HTMLElement)

            if (instance) {
              instance.setContent(tooltip)
            } else if (!instance) {
              tippyInstances.set(e.target as HTMLElement, tippy(e.target as HTMLElement, { content: tooltip } as any))
              tippySingleton.setInstances(Array.from(tippyInstances.values()))
            }
          }
        }
      }
    }

    return {
      SQUARE_BORDER_SIZE,
      SQUARE_SIZE,
      LEFT_SECTION_WIDTH,
      RIGHT_SECTION_WIDTH,
      TOP_SECTION_HEIGHT,
      BOTTOM_SECTION_HEIGHT,
      svg,
      heatmap,
      now,
      width,
      height,
      viewbox,
      daysLabelWrapperTransform,
      monthsLabelWrapperTransform,
      yearWrapperTransform,
      legendWrapperTransform,
      lo,
      legendViewbox,
      curRangeColor: rangeColor,
      getWeekPosition,
      getDayPosition,
      getMonthLabelPosition,
      initTippyLazy,
    }
  },
})
</script>

<template>
  <div
    class="vch__container"
    :class="{ 'dark-mode': darkMode }"
  >
    <svg
      ref="svg"
      class="vch__wrapper"
      :viewBox="viewbox"
    >
      <g
        class="vch__months__labels__wrapper"
        :transform="monthsLabelWrapperTransform"
      >
        <text
          v-for="(month, index) in heatmap.firstFullWeekOfMonths"
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
        >{{ lo.less }}</text>
        <rect
          v-for="(color, index) in curRangeColor"
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
          :y="SQUARE_SIZE * (curRangeColor.length + 2) - SQUARE_BORDER_SIZE"
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
          v-for="(week, weekIndex) in heatmap.calendar"
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
              :style="{ fill: curRangeColor[day.colorIndex] }"
              :data-week-index="weekIndex"
              :data-day-index="dayIndex"
              @click="$emit('dayClick', day)"
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
                    v-for="(color, index) in curRangeColor"
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
