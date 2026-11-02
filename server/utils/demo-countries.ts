import { randomUUID } from 'node:crypto'
import type { Country, CountryInput } from '@org/country'
// Demo only: isolated by signed session ID, expires after 8h; not a database.
const datasets = new Map<string, { expires: number; rows: Country[] }>()
export function demoCountries(sessionId: string) {
  const now = Date.now()
  for (const [key, value] of datasets)
    if (value.expires < now) datasets.delete(key)
  if (!datasets.has(sessionId)) {
    if (datasets.size >= 1000) datasets.delete(datasets.keys().next().value!)
    datasets.set(sessionId, {
      expires: now + 8 * 3600000,
      rows: [
        { code: 'VN', name: 'Việt Nam', region: 'Asia', active: true },
        { code: 'JP', name: 'Nhật Bản', region: 'Asia', active: true },
        { code: 'SG', name: 'Singapore', region: 'Asia', active: true },
        { code: 'FR', name: 'Pháp', region: 'Europe', active: true },
        { code: 'US', name: 'Hoa Kỳ', region: 'Americas', active: false },
      ].map((row) => ({ ...row, id: randomUUID() })) as Country[],
    })
  }
  return datasets.get(sessionId)!.rows
}
export function saveDemoCountry(
  rows: Country[],
  input: CountryInput,
  id?: string,
) {
  const index = id ? rows.findIndex((row) => row.id === id) : -1
  if (id && index < 0)
    throw createError({ statusCode: 404, message: 'Không tìm thấy quốc gia' })
  if (rows.some((row) => row.code === input.code && row.id !== id))
    throw createError({ statusCode: 409, message: 'Mã quốc gia đã tồn tại' })
  const row = { ...input, id: id || randomUUID() }
  if (id) rows[index] = row
  else rows.push(row)
  return row
}
