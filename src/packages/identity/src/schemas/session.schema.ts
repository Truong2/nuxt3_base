import { z } from 'zod'
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  permissions: z.array(z.string()),
})
export type SessionUser = z.infer<typeof userSchema>
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
})
