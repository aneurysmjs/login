import { afterEach, describe, expect, it, vi } from 'vitest'

import { createHeatmap, shiftDate } from './heatmapUtils'

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

  // describe('createHeatmap', () => {
  //   it('resolves logged user data', () => {
  //     const response = createHeatmap()

  //     expect(response).toStrictEqual({ name: 'John Doe' })
  //   })
  // })
})
