import { z } from 'zod'
import { createApiClient } from '@org/api-core'
import {
  countrySchema,
  countryListSchema,
  type CountryInput,
} from '../schemas/country.schema'
export function createCountryRepository(
  client: ReturnType<typeof createApiClient>,
) {
  return {
    list: () => client.request('/countries', countryListSchema),
    create: (body: CountryInput) =>
      client.request('/countries', countrySchema, { method: 'POST', body }),
    update: (id: string, body: CountryInput) =>
      client.request(`/countries/${encodeURIComponent(id)}`, countrySchema, {
        method: 'PUT',
        body,
      }),
    remove: (id: string) =>
      client.request(
        `/countries/${encodeURIComponent(id)}`,
        z.object({ id: z.string() }),
        { method: 'DELETE' },
      ),
  }
}
