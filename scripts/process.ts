const commands = [`docker`, `build`, '--pull', '--rm', '-f', '/Users/daniel/homelab/GitHub/nuxt-elysia/final-paas/temp/13f1f268-f77b-40dd-8f42-e5ede853cacc/Dockerfile', `-t`, `wqerqwer33234`, '/Users/daniel/homelab/GitHub/nuxt-elysia/final-paas/temp/13f1f268-f77b-40dd-8f42-e5ede853cacc']

const spawned = Bun.spawn(commands, { stdin: 'inherit', stdout: 'pipe', stderr: 'pipe' })

const decoder = new TextDecoder()

let buffer = ''

function write(data: Uint8Array) {
  buffer += decoder.decode(data, { stream: true })
}

spawned.stdout.pipeTo(new WritableStream({ write }))
spawned.stderr.pipeTo(new WritableStream({ write }))

// spawned.stdin.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
// spawned.stdin.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
const code = await spawned.exited
console.log({ buffer })
process.exit(code)
export { }
