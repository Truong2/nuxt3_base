export function allowedCountryRoute(path: string, method: string) {
  if (path === 'countries') return ['GET', 'POST'].includes(method)
  return (
    /^countries\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      path,
    ) && ['PUT', 'DELETE'].includes(method)
  )
}
