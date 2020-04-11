import { Recipe } from '../../models'
import { log, S3File } from './common'

const loader = require('./loader')
const parser = require('./parser')
const archiver = require('./archiver')
const v = require('./validator')
const moment = require('moment')

export async function Import(
  file: S3File,
  user: number
): Promise<ImportResult> {
  return new Promise<ImportResult>(async resolve => {
    const start = moment()
    log(`Importing file ${file.key} for user ${user}`)
    try {
      const text = await loader.load(file)
      log('Loaded')
      const parsed = parser.parse(text)
      log('Parsed')
      let { status, errors } = v.validate(parsed)
      log('Validated')
      if (status == ImportStatus.Failed) {
        log(`Import failed ${errors}`)
        resolve(
          new ImportResult(user, file, parsed, text, status, new Error(errors))
        )
      } else {
        let recipe = await Recipe.createNewRecipe(user, parsed)
        log('Posted')
        await archiver.archive(file)
        log('Archived')
        status = status ? status : ImportStatus.Imported
        resolve(new ImportResult(user, file, recipe, text, status, null))
      }
    } catch (err) {
      log(
        `Failed to process ${file.originalname} for user ${user}\n ${
          err instanceof Error ? err.stack : err
        }`
      )
      resolve(
        new ImportResult(user, file, null, null, ImportStatus.Failed, err)
      )
    }
    const d = moment.duration(moment().diff(start))
    log(`Message processed: ${d.asSeconds()} seconds`)
  })
}

export enum ImportStatus {
  Unknown,
  Imported,
  Incomplete,
  Failed
}

export class ImportResult {
  constructor(
    readonly user: number,
    readonly file: S3File,
    readonly recipe: Recipe,
    readonly text: string[],
    readonly status: ImportStatus,
    readonly error: Error
  ) {}
}
