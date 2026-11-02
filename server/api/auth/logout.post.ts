import { appSession } from '../../utils/session'
export default defineEventHandler(async (event) => {
  await (await appSession(event)).clear()
  return { success: true }
})
