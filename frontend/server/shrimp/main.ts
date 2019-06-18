const loader = require('./loader')
const parser = require('./parser')
const poster = require('./poster')

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
          log(`Received message ${JSON.stringify(msg, null, 2)}`)
          try {
            const text = await loader.load(msg.file)
            const recipe = parser.parse(text)
            //            console.log(JSON.stringify(recipe, null, 2))
            // TODO validate
            await poster.post(recipe, msg.user)
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
