import { randomUUID } from 'node:crypto'
export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api/')) return
  setHeader(event, 'Cache-Control', 'no-store')
  setHeader(event, 'X-Content-Type-Options', 'nosniff')
  setHeader(event, 'X-Request-ID', randomUUID())
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(event.method)) {
    // Compare against configured public origin, never a user-controlled Host header.
    const origin = getHeader(event, 'origin')
    const allowedOrigin = useRuntimeConfig(event).appOrigin
    if (!origin || origin !== allowedOrigin)
      throw createError({ statusCode: 403, message: 'Origin không hợp lệ' })
    const length = Number(getHeader(event, 'content-length') || 0)
    if (length > 16384)
      throw createError({ statusCode: 413, message: 'Payload quá lớn' })
  }
})
