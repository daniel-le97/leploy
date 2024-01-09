import { randomBytes } from 'node:crypto'

export function generateSecret(length: number = 32) {
  // Generate secure random bytes
  const bytes = randomBytes(length)

  // Convert bytes to a hexadecimal string
  const secret = bytes.toString('hex')

  return secret
}
