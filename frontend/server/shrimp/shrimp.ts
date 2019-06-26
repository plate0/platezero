import { Recipe } from '../../models'
import { log, S3File } from './common'

const loader = require('./loader')
const parser = require('./parser')
const poster = require('./poster')
const archiver = require('./archiver')
const v = require('./validator')
const moment = require('moment')

export async function importFile(file: S3File, user: number): Promise<Recipe> {
  return new Promise<Recipe>(async resolve => {
    const start = moment()
    log(`Importing file ${file.key} for user ${user}`)
    try {
      const text = await loader.load(file)
      log('Loaded')
      log(text)
      const parsed = parser.parse(text)
      log('Parsed')
      const errors = v.validate(parsed)
      if (errors && errors.length > 0) {
        throw 'Validation failed:\n' + errors.join('\n') + '\n'
      }
      log('Validated')
      let recipe = await poster.post(parsed, user)
      log('Posted')
      await archiver.archive(file)
      log('Achived')
      const d = moment.duration(moment().diff(start))
      log(`Message processed: ${d.asSeconds()} seconds`)
      resolve(recipe)
    } catch (err) {
      log(
        `Failed to process ${file.originalname} for user ${user}\n ${
          err instanceof Error ? err.stack : err
        }`
      )
      resolve(null)
    }
  })
}
