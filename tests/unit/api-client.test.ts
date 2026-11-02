import { describe, it, expect } from 'vitest'
import type { $Fetch } from 'ofetch'
import { z } from 'zod'
import { createApiClient } from '@org/api-core'
const mock = (fn: () => Promise<unknown>) => fn as unknown as $Fetch
describe('API client', () => {
  it('unwraps and validates envelope', async () => {
    const api = createApiClient(
      mock(async () => ({ success: true, data: { name: 'VN' } })),
    )
    expect(
      await api.request('/countries', z.object({ name: z.string() })),
    ).toEqual({ name: 'VN' })
  })
  it('rejects malformed backend data', async () => {
    const api = createApiClient(mock(async () => ({ success: true, data: 3 })))
    await expect(api.request('/countries', z.string())).rejects.toMatchObject({
      code: 'INVALID_RESPONSE',
      status: 502,
    })
  })
  it.each([401, 403, 404, 422, 429, 500])(
    'retains HTTP %s',
    async (statusCode) => {
      const api = createApiClient(
        mock(async () => {
          throw { statusCode, data: { message: 'Rejected' } }
        }),
      )
      await expect(api.request('/countries', z.string())).rejects.toMatchObject(
        { status: statusCode },
      )
    },
  )
  it('normalizes timeout', async () => {
    const api = createApiClient(
      mock(async () => {
        throw { name: 'AbortError' }
      }),
    )
    await expect(api.request('/countries', z.string())).rejects.toMatchObject({
      code: 'TIMEOUT',
    })
  })
})
