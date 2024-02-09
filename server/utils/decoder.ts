export const decoder = new TextDecoder()

export function decode(chunk: Uint8Array) {
  if (chunk instanceof Uint8Array || Buffer.isBuffer(chunk))
    return decoder.decode(chunk, { stream: true })

  return chunk as string
}
