export type ApiSuccess<T> = { success: true; data: T }
export const formatNumber = (value: number) =>
  new Intl.NumberFormat('vi-VN').format(value)
