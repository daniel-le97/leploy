async function getLatestCommitHash(owner = '', repo = '', branch = 'main') {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`
  const response = await fetch(apiUrl)
  if (!response.ok)
    throw new Error(`Failed to fetch latest commit hash from ${apiUrl}: ${response.status} ${response.statusText}`)

  const commitInfo = await response.json()
  return commitInfo.sha
}

// Example usage
const owner = 'daniel-le97'
const repo = 'nitro-app-bun'
const branch = 'main'

getLatestCommitHash(owner, repo, branch)
  .then((commitHash) => {
    console.log('Latest commit hash:', commitHash)
  })
  .catch((error) => {
    console.error('Error:', error)
  })
