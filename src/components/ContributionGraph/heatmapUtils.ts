export interface HeatmapValue {
  date: Date | string
  count: number
}

export interface Activity {
  count: number
  colorIndex: number
}

export type Activities = Map<string, Activity>

export interface CalendarItem {
  date: Date
  count?: number
  colorIndex: number
}

export type Calendar = CalendarItem[][]

export interface Month {
  value: number
  index: number
}

export interface Locale {
  months: string[]
  days: string[]
  on: string
  less: string
  more: string
}

export type TooltipFormatter = (item: CalendarItem, unit: string) => string

export const DEFAULT_RANGE_COLOR_LIGHT = ['#ebedf0', '#dae2ef', '#c0ddf9', '#73b3f3', '#3886e1', '#17459e']
export const DEFAULT_RANGE_COLOR_DARK = ['#1f1f22', '#1e334a', '#1d466c', '#1d5689', '#1d69ac', '#1B95D1']
export const DEFAULT_LOCALE: Locale = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  on: 'on',
  less: 'Less',
  more: 'More',
}
export const DEFAULT_TOOLTIP_UNIT = 'contributions'
export const DAYS_IN_ONE_YEAR = 365
export const DAYS_IN_WEEK = 7
export const SQUARE_SIZE = 10

/**
 *
 * @param date
 * @param numDays
 */
export function shiftDate(date: Date | string, numDays: number) {
  const newDate = new Date(date)

  newDate.setDate(newDate.getDate() + numDays)

  return newDate
}

function parseDate(entry: Date | string) {
  return (entry instanceof Date) ? entry : (new Date(entry))
}

function keyDayParser(date: Date | string) {
  const day = parseDate(date)

  return String(day.getFullYear()) + String(day.getMonth()).padStart(2, '0') + String(day.getDate()).padStart(2, '0')
}

/**
 *
 * @param calendarEndDate Can be a date parseable string, a millisecond timestamp, or a Date object.
 *                        The calendar will start automatically one year before this date.
 * @param calendarValues Array of objects with date and count keys. date values can be a date parseable string,
 *                       a millisecond timestamp, or a Date object. count value should be a number.
 * @param maxColor Any number which should be the max color.
 */
export function createHeatmap(calendarEndDate: Date | string, calendarValues: HeatmapValue[], maxColor?: number) {
  const endDate = parseDate(calendarEndDate)
  const max = maxColor || Math.ceil((Math.max(...calendarValues.map(day => day.count)) / 5) * 4)
  const startDate = shiftDate(endDate, -DAYS_IN_ONE_YEAR)
  const values = structuredClone(calendarValues)

  const weekCount = getDaysCount() / DAYS_IN_WEEK

  function getColorIndex(count?: number) {
    if (count === null || count === undefined) {
      return 0
    } else if (count <= 0) {
      return 1
    } else if (count >= max) {
      return 5
    } else {
      return (Math.ceil(((count * 100) / max) * (0.03))) + 1
    }
  }

  function getCountEmptyDaysAtStart() {
    return startDate.getDay()
  }

  function getCountEmptyDaysAtEnd() {
    return (DAYS_IN_WEEK - 1) - endDate.getDay()
  }

  function getDaysCount() {
    return DAYS_IN_ONE_YEAR + 1 + getCountEmptyDaysAtStart() + getCountEmptyDaysAtEnd()
  }

  let activities: Activities

  function makeActivities() {
    if (!activities) {
      activities = new Map<string, Activity>()

      for (let i = 0, len = values.length; i < len; i++) {
        activities.set(keyDayParser(values[i].date), {
          count: values[i].count,
          colorIndex: getColorIndex(values[i].count),
        })
      }
    }

    return activities
  }

  let calendar: Calendar

  function getCalendar() {
    if (!calendar) {
      let date = shiftDate(startDate, -getCountEmptyDaysAtStart())

      date = new Date(date.getFullYear(), date.getMonth(), date.getDate())

      // innerCalendar = new Array(weekCount)
      calendar = Array.from({ length: weekCount })

      for (let i = 0, len = calendar.length; i < len; i++) {
        // innerCalendar[i] = new Array(DAYS_IN_WEEK)
        calendar[i] = Array.from({ length: DAYS_IN_WEEK })

        for (let j = 0; j < DAYS_IN_WEEK; j++) {
          // const dayValues = activities.get(keyDayParser(date))
          const dayValues = makeActivities().get(keyDayParser(date))

          calendar![i][j] = {
            date: new Date(date.valueOf()),
            count: dayValues ? dayValues.count : undefined,
            colorIndex: dayValues ? dayValues.colorIndex : 0,
          }

          date.setDate(date.getDate() + 1)
        }
      }
    }

    return calendar
  }

  let innerFirstFullWeekOfMonths: Month[]

  function getFirstFullWeekOfMonths(): Month[] {
    if (!innerFirstFullWeekOfMonths) {
      // const cal = calendar
      const cal = getCalendar()

      innerFirstFullWeekOfMonths = []

      for (let index = 1, len = cal.length; index < len; index += 1) {
        const lastWeek = cal[index - 1][0].date
        const currentWeek = cal[index][0].date

        if (lastWeek.getFullYear() < currentWeek.getFullYear() || lastWeek.getMonth() < currentWeek.getMonth()) {
          innerFirstFullWeekOfMonths.push({ value: currentWeek.getMonth(), index })
        }
      }
    }

    return innerFirstFullWeekOfMonths
  }

  return {
    values,
    weekCount,
    getCalendar,
    getFirstFullWeekOfMonths,
  }
}
