export default defineNitroTask({
  description: 'Run database migrations',
  name: 'build',
  run(payload, context) {
    console.log(context)

    context = 'hello'
    console.log('Running DB migration task...', { payload, context })
    return { result: 'success' }
  },
})
