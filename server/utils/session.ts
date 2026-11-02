import { useSession, createError, type H3Event } from 'h3'
import type { SessionUser } from '@org/identity'
export function isDemo(event: H3Event) {
  return String(useRuntimeConfig(event).demoMode) === 'true'
}
export async function appSession(event: H3Event) {
  const config = useRuntimeConfig(event)
  if (
    config.sessionPassword.length < 32 ||
    config.sessionPassword.startsWith('replace-this')
  )
    throw createError({
      statusCode: 503,
      message: 'Cần cấu hình NUXT_SESSION_PASSWORD ngẫu nhiên (>=32 ký tự)',
    })
  return useSession<{ user?: SessionUser; token?: string }>(event, {
    name: 'atlas-session',
    password: config.sessionPassword,
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      secure: !import.meta.dev,
      sameSite: 'lax',
      path: '/',
    },
  })
}
export async function requirePermission(event: H3Event, permission: string) {
  const session = await appSession(event)
  if (!session.data.user)
    throw createError({ statusCode: 401, message: 'Vui lòng đăng nhập' })
  if (!session.data.user.permissions.includes(permission))
    throw createError({
      statusCode: 403,
      message: 'Bạn không có quyền thực hiện thao tác này',
    })
  return session
}
