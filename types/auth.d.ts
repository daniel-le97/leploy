declare module '#auth-utils' {
  interface UserSession {
    user: {
      spotify?: any
      github?: any
      google?: any
      twitch?: any
      auth0?: any
      microsoft?: any
      discord?: any
      battledotnet?: any
      keycloak?: any
      linkedin?: any
      credentials: {
        id: string
        name?: string
        image?: string
        email?: string
        password?: string
      }
    }
    loggedInAt: number
  }
}

export {}
