import type { OAuthConfig } from '#auth-utils'

export default credentialsRegister({
  async onSuccess(event, _session) {
    const user = _session.user.user as User
    // console.log('credentials:register:onSuccess', user)
    const session = await setUserSession(event, {
      user: {
        credentials: user,
      },
      loggedInAt: Date.now(),
    })
  },
  async onError(event, error) {
    console.log('credentials:register:onerror', error)
    throw error
  },
})

function credentialsRegister({ onSuccess, onError }: OAuthConfig<any>) {
  return defineEventHandler(async (event) => {
    const { email, password: userPass } = await readBody(event)
    if (!email || !userPass) {
      const notFound = createError({
        message: 'please submit and email and password!',
        statusCode: 401,
      })
      if (!onError)
        throw notFound

      return onError(event, notFound)
    }
    const found = usersService.getUserByEmail(email)
    if (found) {
      const notFound = createError({
        message: 'Email already exists! Please login or Use another email.',
        statusCode: 401,
      })
      if (!onError)
        throw notFound

      return onError(event, notFound)
    }
    const name = email.split('@')[0]
    const password = await Bun.password.hash(userPass)
    const id = crypto.randomUUID()
    const image = `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
    usersService.addUser({ id, name, email, password, image })
    return onSuccess(event, {
      user: { user: { id, name, email, image }, loggedInAt: Date.now() },
      tokens: { hello: 'world' },
    })
  })
}
