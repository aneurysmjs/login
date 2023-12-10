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
export const DEFAULT_SQUARE_SIZE = 10

function parseDate(entry: Date | string) {
  return (entry instanceof Date) ? entry : (new Date(entry))
}

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

/**
 *
 * @param entry
 *
 * @example
 *
 * given `2023-12-19T00:00:00.000Z`
 *
 * turns it into
 *
 * 20231109
 */
export function keyDayParser(entry: Date | string) {
  const date = parseDate(entry)

  // String(day.getFullYear()) + String(day.getMonth()).padStart(2, '0') + String(day.getDate()).padStart(2, '0')
  const stringYear = `${date.getFullYear()}`
  // padStart pads when month is of one digit => '5' to '05' for proper date readability
  const stringMonth = `${date.getMonth()}`.padStart(2, '0')
  // padStart pads when date  is of one digit => '5' to '05' for proper date readability
  const stringDate = `${date.getDate()}`.padStart(2, '0')

  return stringYear + stringMonth + stringDate
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
  /**
   * get date on year before as starting date
   *
   * @example
   *
   * 2023-12-09
   *
   * sets
   *
   * 2022-12-09
   */
  const startDate = shiftDate(endDate, -DAYS_IN_ONE_YEAR)
  // example of shifting only 6 months
  // const startDate = shiftDate(endDate, -(Math.round(DAYS_IN_ONE_YEAR / 2)))
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

  /**
   * gets the day of the week to start counting
   */
  function getCountEmptyDaysAtStart() {
    /**
     * The getDay() method returns the day of the week for given date according to local time,
     * where 0 represents Sunday.
     *
     * For the day of the month @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDate.
     */
    return startDate.getDay()
  }

  /**
   * calculate the number of empty days at the end of the calendar.
   */
  function getCountEmptyDaysAtEnd() {
    /**
     * The subtraction by 1 is likely because day indices typically start from 0,
     * so subtracting 1 gives the index of the last day in the week.
     *
     * (DAYS_IN_WEEK - 1) - endDate.getDay(): This expression calculates the number of empty days
     * at the end of the calendar by taking the number of days remaining until the end of the week after endDate.
     * It subtracts the day index of the endDate from the index of the last day in the week.
     *
     * The result is the count of empty days from the last day of the week to the endDate.
     *
     * @example
     *
     * const DAYS_IN_WEEK = 7;
     * const endDate = new Date('2023-08-09');
     *
     * const emptyDaysAtEnd = (DAYS_IN_WEEK - 1) - endDate.getDay();
     *
     * console.log(`Number of empty days at the end: ${emptyDaysAtEnd}`);
     *
     * In this case:
     *
     * endDate.getDay() for August 9, 2023, is a Wednesday, which corresponds to index 3 (assuming Sunday is 0).
     * (DAYS_IN_WEEK - 1) - endDate.getDay() calculates the number of empty days
     * at the end as (7 - 1) - 3 which is 6 - 3 equals 3.
     *
     * So, for the given endDate of August 9, 2023, the output will be: 3
     *
     * This means that in order to complete the last week of the calendar,
     * you would need to include 3 empty days after August 9, 2023.
     *
     */
    return (DAYS_IN_WEEK - 1) - endDate.getDay()
  }

  /**
   * calculates the total number of days in the calendar.
   */
  function getDaysCount() {
    /**
     * DAYS_IN_ONE_YEAR: This constant represents the total number of days in one year.
     * It is added to the count.
     *
     * `+ 1`: Adds 1 to the count. This is likely accounting for some specific requirement or convention,
     * such as ensuring that the starting and ending dates are both included in the count.
     *
     * `+ getCountEmptyDaysAtStart()`: Adds the count of empty days at the start of the calendar.
     *  This is the number of days that need to be added at the beginning to complete the first week.
     *
     * `+ getCountEmptyDaysAtEnd()`: Adds the count of empty days at the end of the calendar.
     * This is the number of days that need to be added at the end to complete the last week.
     *
     * so essentially summing up these components to get the total number of days in the calendar,
     * considering the number of days in a year, adding 1, and accounting for empty days at the start
     * and end to complete the first and last weeks.
     */
    return DAYS_IN_ONE_YEAR + 1 + getCountEmptyDaysAtStart() + getCountEmptyDaysAtEnd()
  }

  let activities: Activities

  function makeActivities() {
    if (!activities) {
      activities = new Map<string, Activity>()

      for (let i = 0, len = values.length; i < len; i += 1) {
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
    // is falsy, it means it hasn't been initialized yet, and the code inside the block will run.
    if (!calendar) {
      /**
       * initialize `date` variable with the starting date for populating the calendar,
       * taking into account the number of empty days at the start.
       */
      let date = shiftDate(startDate, -getCountEmptyDaysAtStart())

      date = new Date(date.getFullYear(), date.getMonth(), date.getDate())

      calendar = Array.from({ length: weekCount })

      for (let i = 0, len = calendar.length; i < len; i += 1) {
        calendar[i] = Array.from({ length: DAYS_IN_WEEK })

        for (let j = 0; j < DAYS_IN_WEEK; j += 1) {
          const dayValues = makeActivities().get(keyDayParser(date))

          calendar![i][j] = {
            // The valueOf() method returns the number of milliseconds for this date
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

  let firstFullWeekOfMonths: Month[]

  function getFirstFullWeekOfMonths(): Month[] {
    // is falsy, it means it hasn't been initialized yet, and the code inside the block will run.
    if (!firstFullWeekOfMonths) {
      const cal = getCalendar()

      /**
       * If firstFullWeekOfMonths is falsy, a new array is created and assigned to firstFullWeekOfMonths.
       * This array will be used to store the identified first full weeks of each month.
       */
      firstFullWeekOfMonths = []

      /**
       * this loop iterates over each week in the calendar (starting from the second week, index = 1)
       */
      for (let index = 1, len = cal.length; index < len; index += 1) {
        /**
         * For each iteration, it compares the first day of the current week (cal[index][0].date)
         * with the first day of the previous week (cal[index - 1][0].date).
         */
        const currentWeek = cal[index][0].date
        const lastWeek = cal[index - 1][0].date

        /**
         * If the month of the current week is different from the month of the previous week, it indicates the
         * start of a new month, and the week is considered the first full week of that month.
         */
        if (lastWeek.getFullYear() < currentWeek.getFullYear() || lastWeek.getMonth() < currentWeek.getMonth()) {
          /**
           * If a new month is identified, an object is pushed.
           *
           * It has two properties:
           *
           * `value`, which is set to the month of the current week (currentWeek.getMonth())
           * `index`, which is set to the index of the current week in the calendar.
           */
          firstFullWeekOfMonths.push({ value: currentWeek.getMonth(), index })
        }
      }
    }

    return firstFullWeekOfMonths
  }

  return {
    values,
    weekCount,
    getCalendar,
    getFirstFullWeekOfMonths,
  }
}
