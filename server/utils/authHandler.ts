import type { EventHandler, EventHandlerRequest } from 'h3'

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
