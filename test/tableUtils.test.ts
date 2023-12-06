import { beforeEach, describe, expect, it } from 'vitest'

import { manageTableFilters } from '../src/utils/tableUtils'

describe('tableUtils', () => {
  describe('manageTableFilters', () => {
    let initialArray: { id: string; value: string }[]

    beforeEach(() => {
      initialArray = [
        { id: '1', value: 'A' },
        { id: '2', value: 'B' },
      ]
    })

    it('should add a new element to the array if it does not exist', () => {
      const newItem = { id: '3', value: 'C' }
      const result = manageTableFilters(initialArray, newItem)

      expect(result).toEqual(expect.arrayContaining([
        { id: '1', value: 'A' },
        { id: '2', value: 'B' },
        { id: '3', value: 'C' },
      ]))
    })

    it('should update an existing element if its ID matches and the value is different', () => {
      const newItem = { id: '1', value: 'C' }
      const result = manageTableFilters(initialArray, newItem)

      expect(result).toEqual(expect.arrayContaining([
        { id: '1', value: 'C' },
        { id: '2', value: 'B' },
      ]))
    })

    it('should remove an element with an empty string value', () => {
      const newItem = { id: '1', value: '' }
      const result = manageTableFilters(initialArray, newItem)

      expect(result).toEqual(expect.arrayContaining([
        { id: '2', value: 'B' },
      ]))

      expect(result).not.toContainEqual(newItem)
    })

    it('should remove an element based on the custom removal condition', () => {
      const newItem = { id: '2', value: 'B' }
      const result = manageTableFilters(initialArray, newItem, item => item.id === '2')

      expect(result).toEqual(expect.arrayContaining([
        { id: '1', value: 'A' },
      ]))

      expect(result).not.toContainEqual({ id: '2', value: 'B' })
    })
  })
})
