import { z } from 'zod'
import { loginSchema, userSchema } from '@org/identity'
import { appSession, isDemo } from '../../utils/session'
export default defineEventHandler(async (event) => {
  const parsed = loginSchema.safeParse(await readBody(event))
  if (!parsed.success)
    throw createError({
      statusCode: 422,
      message: 'Email hoặc mật khẩu không hợp lệ',
    })
  const session = await appSession(event)
  if (isDemo(event)) {
    const { email, password } = parsed.data
    if (
      !['admin@example.com', 'viewer@example.com'].includes(email) ||
      password !== 'Demo@12345'
    )
      throw createError({
        statusCode: 401,
        message: 'Sai tài khoản hoặc mật khẩu',
      })
    const user = {
      id: email,
      email,
      name: email.startsWith('admin') ? 'Demo Admin' : 'Demo Viewer',
      permissions: email.startsWith('admin')
        ? ['country:read', 'country:write']
        : ['country:read'],
    }
    await session.clear()
    await session.update({ user })
    return { user }
  }
  const config = useRuntimeConfig(event)
  if (!config.apiBaseUrl.startsWith('https://'))
    throw createError({
      statusCode: 503,
      message: 'Cần cấu hình HTTPS backend',
    })
  // Backend MUST enforce password hashing, account lockout/rate limits and return this contract.
  try {
    const raw = await $fetch('/auth/login', {
      baseURL: config.apiBaseUrl,
      method: 'POST',
      body: parsed.data,
      timeout: 15000,
      retry: 0,
      redirect: 'error',
    })
    const { user, accessToken } = z
      .object({ user: userSchema, accessToken: z.string().min(1).max(1500) })
      .parse(raw)
    await session.clear()
    await session.update({ user, token: accessToken })
    return { user }
  } catch {
    throw createError({ statusCode: 401, message: 'Không thể đăng nhập' })
  }
})
