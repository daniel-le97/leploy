import type { H3Event } from 'h3'
import type { UserSession } from '#auth-utils'

export async function useAuthSession(event: H3Event) {
  const session = await getUserSession(event)
  return getUser(session)
}
export async function requireAuthSession(event: H3Event) {
  const session = await requireUserSession(event)
  const user = getUser(session)
  if (!user)
    throw createError('user not found')

  return user
}

function getUser(session: UserSession) {
  const user = session.user as { credentials: User }
  return user.credentials
}
