export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') return
  const { user, refreshSession } = useIdentity()
  if (!user.value) await refreshSession()
  if (!user.value) return navigateTo('/login')
})
