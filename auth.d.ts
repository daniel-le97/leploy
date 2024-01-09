import type { User } from './server/utils/users'

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
      credentials: User
    }
    loggedInAt: number
  }
}

export {}
