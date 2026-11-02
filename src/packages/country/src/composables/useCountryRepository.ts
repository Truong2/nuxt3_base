import { createApiClient } from '@org/api-core'
import { createCountryRepository } from '../api/country.repository'
export function useCountryRepository() {
  return createCountryRepository(
    createApiClient(useRequestFetch(), useRuntimeConfig().public.apiPrefix),
  )
}
