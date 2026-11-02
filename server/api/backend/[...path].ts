import { countryInputSchema } from '@org/country'
import { appSession, isDemo, requirePermission } from '../../utils/session'
import { demoCountries, saveDemoCountry } from '../../utils/demo-countries'
import { allowedCountryRoute } from '../../utils/backend-policy'
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') || ''
  if (!allowedCountryRoute(path, event.method))
    throw createError({ statusCode: 404, message: 'Endpoint không được phép' })
  const session = await requirePermission(
    event,
    event.method === 'GET' ? 'country:read' : 'country:write',
  )
  let body
  if (['POST', 'PUT'].includes(event.method)) {
    const parsed = countryInputSchema.safeParse(await readBody(event))
    if (!parsed.success)
      throw createError({
        statusCode: 422,
        message: 'Dữ liệu không hợp lệ',
        data: { errors: parsed.error.flatten().fieldErrors },
      })
    body = parsed.data
  }
  const id = path.split('/')[1]
  if (isDemo(event)) {
    const rows = demoCountries(session.id!)
    if (event.method === 'GET') return { success: true, data: rows }
    if (event.method === 'DELETE') {
      const index = rows.findIndex((row) => row.id === id)
      if (index < 0)
        throw createError({
          statusCode: 404,
          message: 'Không tìm thấy quốc gia',
        })
      rows.splice(index, 1)
      return { success: true, data: { id } }
    }
    return { success: true, data: saveDemoCountry(rows, body!, id) }
  }
  const config = useRuntimeConfig(event)
  const { data } = await appSession(event)
  if (!config.apiBaseUrl.startsWith('https://') || !data.token)
    throw createError({
      statusCode: 503,
      message: 'Backend chưa được cấu hình',
    })
  try {
    return await $fetch('/' + path, {
      baseURL: config.apiBaseUrl,
      method: event.method as 'GET' | 'POST' | 'PUT' | 'DELETE',
      body,
      headers: {
        authorization: `Bearer ${data.token}`,
        'x-request-id': String(getResponseHeader(event, 'x-request-id')),
      },
      timeout: 15000,
      retry: 0,
      redirect: 'error',
    })
  } catch (error) {
    const e = error as { statusCode?: number }
    const statusCode =
      e.statusCode && [401, 403, 404, 409, 422, 429].includes(e.statusCode)
        ? e.statusCode
        : 502
    throw createError({
      statusCode,
      message:
        statusCode === 409
          ? 'Mã quốc gia đã tồn tại'
          : 'Backend không thể xử lý yêu cầu',
    })
  }
})
