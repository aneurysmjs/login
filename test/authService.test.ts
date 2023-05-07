import axios from 'axios'
import { type Mocked, afterEach, describe, expect, it, vi } from 'vitest'

import { login } from '~/services/authService'

vi.mock('axios')

const mockAxios = axios as Mocked<typeof axios>

describe('authService', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('login', () => {
    it('resolves logged user data', async () => {
      mockAxios.post.mockResolvedValue({ data: { name: 'John Doe' } })
      const response = await login()

      expect(response).toStrictEqual({ name: 'John Doe' })
    })

    it('rejects due bad request', async () => {
      const networkError = new Error('Network Error')
      const expectedError = new Error('Opps, something went wrong, "Network Error"')
      mockAxios.post.mockRejectedValue(networkError)

      await expect(login()).rejects.toStrictEqual(expectedError)
    })
  })
})
