export async function useCredentials(route: 'login' | 'register', body: { email: string, password: string }) {
  try {
    const { fetch } = useUserSession()
    const url = `/auth/credentials/${route}`
    const fetched = await $fetch(url, {
      method: 'POST',
      body,
    })
    // await navigateTo('/')
    await fetch()
  }
  catch (error) {
    console.log('useCredentials:error', error)
  }
}

export async function authLogout() {
  const { clear } = useUserSession()
  await clear()
  await navigateTo('/login')
}
