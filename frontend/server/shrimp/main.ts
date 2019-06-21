import { log } from './common'

const loader = require('./loader')
const parser = require('./parser')
const poster = require('./poster')
const archiver = require('./archiver')
const v = require('./validator')

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
            log(text)
            const recipe = parser.parse(text)
            log('Parsed')
            const errors = v.validate(recipe)
            if (errors && errors.length > 0) {
              throw 'Validation failed:\n' + errors.join('\n') + '\n'
            }
            log('Validated')
            await poster.post(recipe, msg.user)
            log('Posted')
            await archiver.archive(msg.file)
            log('Achived')
          } catch (err) {
            log(
              `Failed to process ${msg.file.originalname} for user ${
                msg.user
              }\n ${err instanceof Error ? err.stack : err}`
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

run()
