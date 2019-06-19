const loader = require('./loader')
const parser = require('./parser')
const poster = require('./poster')
const archiver = require('./archiver')
const v = require('./validator')

interface S3File {
  originalname: string
  encoding: string
  mimetype: string
  size: number
  bucket: string
  key: string
  acl: string
  contentType: string
  contentDisposition: string
  storageClass: string
  serverSideEncryption: string
  metadata: string
  location: string
  etag: string
}

async function run() {
  log('Process running')
  const code = await processMessages()
  log('Process terminating with code ${code}')
  process.exitCode = code
}

async function processMessages(): Promise<number> {
  return new Promise<number>(async (resolve, reject) => {
    try {
      log('Waiting for messages')
      let msg
      do {
        msg = await getMessage()
        if (msg) {
          log(`Received message file: ${msg.file.key}, user: ${msg.user}`)
          try {
            const text = await loader.load(msg.file)
            log('Loaded')
            const recipe = parser.parse(text)
            log('Parsed')
            const errors = v.validate(recipe)
            if (errors && errors.length > 0) {
              throw new Error('Validation failed:\n' + errors.join('\n'))
            }
            log('Validated')
            await poster.post(recipe, msg.user)
            log('Posted')
            await archiver.archive(msg.file)
            log('Achived')
          } catch (err) {
            console.error(
              `Failed to process ${msg.file.originalname} for user ${
                msg.user
              }\n\t${err}`
            )
          }
        }
      } while (msg)
      resolve(0)
    } catch (err) {
      console.error('Shrimp: ' + err)
      reject(1)
    }
  })
}

async function getMessage() {
  return new Promise((resolve, _reject) => {
    process.on('message', message => {
      resolve(message)
    })
  })
}

function log(text) {
  console.log(`Shrimp: ${text}`)
}

run()
