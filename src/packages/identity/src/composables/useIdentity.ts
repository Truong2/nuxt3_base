import type { SessionUser } from '../schemas/session.schema'
export function useIdentity() {
  const user = useState<SessionUser | null>('identity:user', () => null)
  const request = useRequestFetch()
  async function refreshSession() {
    const result = await request<{ user: SessionUser | null; demo: boolean }>(
      '/api/auth/session',
    )
    user.value = result.user
    return result
  }
  async function login(email: string, password: string) {
    const result = await $fetch<{ user: SessionUser }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = result.user
  }
  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    clearNuxtData()
    await navigateTo('/login')
  }
  return {
    user,
    refreshSession,
    login,
    logout,
    can: (permission: string) =>
      user.value?.permissions.includes(permission) ?? false,
  }
}
