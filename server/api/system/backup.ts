const minioEndpoint = 'http://minio-server:9000'
const accessKey = 'your-access-key'
const secretKey = 'your-secret-key'
const bucketName = 'your-bucket'

export default defineAuthRequiredHandler(async (event) => {
  throw NOTIMPLEMENTED

  const backupDir = `/.data`
  const backup = Bun.spawn({
    cmd: ['mc', '', '--overwrite', '--remove', 'local', 'backup', '--recursive'],
    env: {
      MC_HOST: minioEndpoint,
      MC_ACCESS_KEY: accessKey,
      MC_SECRET_KEY: secretKey,
    },
    cwd: process.cwd(),
  })
})
