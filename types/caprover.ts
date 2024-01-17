interface CaproverOneClickAppVariable {
  id: string
  label: string
  defaultValue?: string
  description?: string
  validRegex?: RegExp
}

interface CaproverOneClickAppInstructions {
  start?: string
  end?: string
}

// interface CaproverOneClickAppConfig {
//   caproverOneClickApp: {
//     variables: CaproverOneClickAppVariable[]
//     instructions: CaproverOneClickAppInstructions
//     displayName: string
//     isOfficial: boolean
//     description: string
//     documentation: string
//   }
// }

export interface CaproverDockerComposeConfig {
  captainVersion: number
  services: {
    [serviceName: string]: {
      depends_on?: string[]
      image: string
      restart: string
      environment: {
        WAIT_HOSTS: string
        Caprover_MONGODB: string
        Caprover_USERNAME: string
        Caprover_PASSWORD: string
        Caprover_ALLOW_ORIGIN: string
      }
      caproverExtra: {
        containerHttpPort: string
      }
    }
  }
  caproverOneClickApp?: {
    variables: CaproverOneClickAppVariable[]
    instructions: {
      start: string
      end: string
    }
    displayName: string
    isOfficial: boolean
    description: string
    documentation: string
  }
}
export type CaproverTemplate = {
  showFullDescription: boolean
  name: string
  displayName: string
  description: string
  isOfficial: boolean
  logoUrl: string
}[]
