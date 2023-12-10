import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createHeatmap, keyDayParser, shiftDate } from './heatmapUtils'

import { data } from './data'

const date = new Date('2023-12-09')

vi.setSystemTime(date)

describe('heatmapUtils', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('shiftDate', () => {
    it('shift date forwards by 10 days', () => {
      const today = new Date() // 2023-12-09T00:00:00.000Z

      const shiftedDate = shiftDate(today, 10)

      expect(shiftedDate.toISOString()).toBe('2023-12-19T00:00:00.000Z')
    })

    it('shift date backwards by 10 days', () => {
      const today = new Date() // 2023-12-09T00:00:00.000Z

      const shiftedDate = shiftDate(today, -10)

      expect(shiftedDate.toISOString()).toBe('2023-11-29T00:00:00.000Z')
    })
  })

  describe('keyDayParser', () => {
    it('parses date to yyyymmdd', () => {
      const today = new Date() // 2023-12-09T00:00:00.000Z

      const parsedDate = keyDayParser(today)

      expect(parsedDate).toBe('20231109')
    })
  })

  describe('createHeatmap', () => {
    beforeEach(() => {

    })

    it('creates a heatmap object API', () => {
      // const fakeEndDate = new Date('2023-08-09') //
      const fakeEndDate = new Date('2023-08-09')
      const heatmap = createHeatmap(fakeEndDate, data)

      expect(heatmap).toHaveProperty('values')
      expect(heatmap).toHaveProperty('weekCount')
      expect(heatmap).toHaveProperty('getCalendar')
      expect(heatmap).toHaveProperty('getFirstFullWeekOfMonths')
    })
  })
})
