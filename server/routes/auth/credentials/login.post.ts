import type { OAuthConfig } from '#auth-utils'

export default credentialsLogin({
  async onSuccess(event, session) {
    const user = session.user.user as User

    await setUserSession(event, {
      user: {
        credentials: user,
      },
      loggedInAt: Date.now(),
    })
    return await sendRedirect(event, '/')
  },
  async onError(event, error) {
    console.log('credentialsEventHandler onError', error)
    throw error
  },
})

function credentialsLogin({ onSuccess, onError }: OAuthConfig<any>) {
  return defineEventHandler(async (event) => {
    const { email, password } = await readBody(event)
    const found = usersService.getUserByEmail(email)

    if (!found) {
      const notFound = createError({
        message: 'Email not found! Please register.',
        statusCode: 401,
      })
      if (!onError)
        throw notFound

      return onError(event, notFound)
    }

    if (!(await Bun.password.verify(password, found.password))) {
      const Incorrect = createError({
        message: 'Incorrect password!',
        statusCode: 401,
      })
      if (!onError)
        throw Incorrect

      return onError(event, Incorrect)
    }

    return onSuccess(event, {
      user: { user: {
        id: found.id,
        name: found.name,
        email: found.email,
        image: found.image,
      }, loggedInAt: Date.now() },
      tokens: { hello: 'world' },
    })
  })
}
