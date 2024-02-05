import * as fs from 'node:fs'
import * as path from 'node:path'
import { createTarGzip } from 'nanotar'

const fileDetails: { filename: string, path: string }[] = []
const usedPaths: string[] = []
const exclude = ['.git']
async function getAllFilesInDirectory(dirPath: string, fileList: { name: string, full: string }[] = []) {
  try {
    const files = fs.readdirSync(dirPath)
    usedPaths.push(dirPath)
    files.forEach(async (file) => {
      const filePath = path.join(dirPath, file)
      if (fs.statSync(filePath).isDirectory()) { getAllFilesInDirectory(filePath, fileList) } // Recurse into subdirectories
      else {
        let shouldInclude = true
        exclude.forEach((path) => {
          if (filePath.includes(path))
            shouldInclude = false
        })
        const finalPath = filePath.replace(`${usedPaths[0]}/`, '')
        if (finalPath.startsWith('.'))
          shouldInclude = false

        if (shouldInclude) {
          // const uint = new Uint8Array(arrayBuffer)
          fileList.push({ name: finalPath, full: filePath })
        }
      } // Add the file path to the list
    })

    return fileList
  }
  catch (error) {
    console.log('Error: ', error)
  }
}

// Example usage:
const directoryPath = '/Users/daniel/homelab/GitHub/nuxt-elysia/final-paas/temp/13f1f268-f77b-40dd-8f42-e5ede853cacc'
const filesInDirectory = await getAllFilesInDirectory(directoryPath)
console.log(filesInDirectory)
