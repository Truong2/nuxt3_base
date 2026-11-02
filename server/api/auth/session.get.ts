import { appSession, isDemo } from '../../utils/session'
export default defineEventHandler(async (event) => {
  const session = await appSession(event)
  return { user: session.data.user ?? null, demo: isDemo(event) }
})
