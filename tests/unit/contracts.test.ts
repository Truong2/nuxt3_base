import { describe, it, expect } from 'vitest'
import { countryInputSchema } from '@org/country'
import { allowedCountryRoute } from '../../server/utils/backend-policy'
describe('Country contract', () => {
  it('normalizes input and rejects invalid codes', () => {
    expect(
      countryInputSchema.parse({
        code: ' vn ',
        name: ' Việt Nam ',
        region: 'Asia',
        active: true,
      }).code,
    ).toBe('VN')
    expect(countryInputSchema.safeParse({ code: 'VNN' }).success).toBe(false)
  })
  it('rejects unsupported regions', () => {
    expect(
      countryInputSchema.safeParse({
        code: 'VN',
        name: 'VN',
        region: 'Unknown',
        active: true,
      }).success,
    ).toBe(false)
  })
})
describe('BFF allowlist', () => {
  it('allows supported methods only', () => {
    expect(allowedCountryRoute('countries', 'GET')).toBe(true)
    expect(allowedCountryRoute('countries', 'DELETE')).toBe(false)
  })
  it.each([
    'https://evil.com',
    '../auth',
    'countries/../auth',
    'countries/%2e%2e',
    'countries?id=1',
    'countries//x',
  ])('rejects %s', (path) =>
    expect(allowedCountryRoute(path, 'GET')).toBe(false),
  )
})
