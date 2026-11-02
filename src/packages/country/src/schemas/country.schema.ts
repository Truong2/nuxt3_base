import { z } from 'zod'
export const countryInputSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/, 'Mã gồm 2 chữ cái'),
  name: z.string().trim().min(2, 'Tên cần ít nhất 2 ký tự').max(100),
  region: z.enum(['Asia', 'Europe', 'Americas', 'Africa', 'Oceania']),
  active: z.boolean(),
})
export const countrySchema = countryInputSchema.extend({
  id: z.string().uuid(),
})
export const countryListSchema = z.array(countrySchema)
export type Country = z.infer<typeof countrySchema>
export type CountryInput = z.infer<typeof countryInputSchema>
