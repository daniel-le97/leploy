import { $, type ShellOutput } from 'bun'

let code = 0
function keepRunning(output: ShellOutput) {
  code = output.exitCode
  if (code !== 0 || Number(code) !== 0)
    process.exit(code)
}
const image = 'ghcr.io/daniel-le97/leploy'
try {
  if (!process.env.GITHUB_PERSONAL_TOKEN) {
    console.error('GitHub personal access token is not set. Set the GITHUB_PERSONAL_TOKEN environment variable.')
    process.exit(1)
  }

  const dockerFile = Bun.file('dockerfile')
  const cwd = process.cwd()
  console.log(cwd)

  $.cwd(cwd)
  // await $`bun run build`
  keepRunning(await $`docker build --pull --rm -f "dockerfile" -t ${image} "."`)
  keepRunning(await $`docker login ${image.split('/')[0]} -u ${image.split('/')[1]} -p ${process.env.GITHUB_PERSONAL_TOKEN}`)
  keepRunning(await $`docker push ${image}`)
}
catch (error) {
  console.error(error)
  code = 1
}
finally {
  process.exit(code)
}
