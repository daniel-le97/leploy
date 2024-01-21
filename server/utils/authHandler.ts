import type { EventHandler, EventHandlerRequest, H3Event } from 'h3'

import type { UserSession } from '#auth-utils'

export async function useAuthSession(event: H3Event) {
  const session = await getUserSession(event)
  return getUser(session)
}
export async function requireAuthSession(event: H3Event) {
  const session = await requireUserSession(event)
  const user = getUser(session)
  if (!user || !user.id)
    throw createError('user not found')

  return user as { id: string }
}

function getUser(session: UserSession) {
  const user = session.user as Record<string, any>
  let id: string | undefined
  let name: string | undefined
  for (const [key, value] of Object.entries(user)) {
    if (value.id)
      name = key
    id = value.id
  }
  return {id}
}

export function defineAuthRequiredHandler<T extends EventHandlerRequest, D>(handler: EventHandler<T, D>): EventHandler<T, D> {
  return defineEventHandler<T>(async (event) => {
    try {
      const user = await requireAuthSession(event)
      event.context.user = user
      return await handler(event)
    }
    catch (err) {
      throw UNAUTHORIZED
    }
  })
}
