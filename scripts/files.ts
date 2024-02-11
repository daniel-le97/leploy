import { Glob } from 'bun'

const fileDetails: { filename: string, path: string }[] = []
const usedPaths: string[] = []
const exclude = ['.git']
async function getAllFilesInDirectory(dirPath: string) {
  try {
    const glob = new Glob('**')
    const files = await Array.fromAsync(glob.scan(dirPath))
    return files
  }
  catch (error) {
    console.error('Error: ', error)
  }
}

// Example usage:
const directoryPath = '/Users/daniel/homelab/GitHub/nuxt-elysia/final-paas/.data'
const filesInDirectory = await getAllFilesInDirectory(directoryPath)
console.log(filesInDirectory)
