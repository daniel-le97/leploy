const args = process.argv.slice(2)

const file = Bun.file(args[0])
if (!file.exists) {
  console.log('file not found:', args[0])
  process.exit(1)
}
console.log(file.name, '-', (file.size / (1024 * 1024)).toFixed(2), 'MB')
