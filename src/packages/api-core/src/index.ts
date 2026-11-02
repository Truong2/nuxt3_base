import { z, type ZodType } from 'zod'
export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  baseURL?: string
  body?: Record<string, unknown>
  headers?: HeadersInit
  timeout?: number
  retry?: number
  signal?: AbortSignal
}
export type ApiTransport = (
  path: string,
  options?: ApiRequestOptions,
) => Promise<unknown>
const envelopeSchema = z.object({
  success: z.boolean(),
  data: z.unknown(),
  message: z.string().optional(),
})
export class ApiClientError extends Error {
  constructor(
    message: string,
    public status = 500,
    public code = 'API_ERROR',
    public fields: Record<string, string[]> = {},
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}
export function createApiClient(
  fetcher: ApiTransport,
  baseURL = '/api/backend',
) {
  return {
    async request<T>(
      path: string,
      schema: ZodType<T>,
      options: ApiRequestOptions = {},
    ): Promise<T> {
      try {
        const envelope = envelopeSchema.safeParse(
          await fetcher(path, {
            baseURL,
            timeout: 15000,
            retry: 0,
            ...options,
          }),
        )
        if (!envelope.success)
          throw new ApiClientError(
            'Response envelope không hợp lệ',
            502,
            'INVALID_RESPONSE',
          )
        const response = envelope.data
        if (!response.success)
          throw new ApiClientError(response.message || 'Yêu cầu thất bại')
        const result = schema.safeParse(response.data)
        if (!result.success)
          throw new ApiClientError(
            'Dữ liệu trả về không đúng định dạng',
            502,
            'INVALID_RESPONSE',
          )
        return result.data
      } catch (error) {
        if (error instanceof ApiClientError) throw error
        const e = error as {
          statusCode?: number
          data?: {
            message?: string
            data?: { errors?: Record<string, string[]> }
          }
          name?: string
          cause?: { name?: string }
        }
        throw new ApiClientError(
          e.data?.message || 'Không thể kết nối máy chủ',
          e.statusCode || 503,
          [e.name, e.cause?.name].some(
            (name) => name === 'AbortError' || name === 'TimeoutError',
          )
            ? 'TIMEOUT'
            : 'HTTP_ERROR',
          e.data?.data?.errors,
        )
      }
    },
  }
}
