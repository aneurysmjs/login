import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'

dayjs.extend(localeData)

export default function dateUtils() {
  function getMonths() {
    return dayjs().localeData().months()
  }

  return {
    getMonths,
  }
}
