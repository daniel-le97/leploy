const args = process.argv.slice(2)

console.log(args)

const file = Bun.file(args[0])
console.log(file.name, 'is', (file.size / (1024 * 1024)).toFixed(2), 'MB')
