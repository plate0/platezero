import { S3 } from 'aws-sdk'
import { parse, join } from 'path'
import { writeFileSync } from 'fs'
import { exec } from 'child_process'
import * as uuid from 'uuid/v4'
import log from 'electron-log'
const s3 = new S3()

export const download = async (Key: string, dir: string): Promise<string> => {
  log.info('downloading', Key)
  const { base } = parse(Key)
  const res = await s3
    .getObject({
      Bucket: 'com-platezero-recipes',
      Key
    })
    .promise()
  const path = join(dir, base)
  log.info('writing to', path)
  writeFileSync(path, res.Body)
  return path
}

// convert to JPG
export const convert = (dir: string, base: string): Promise<string> => {
  log.info('converting', base, 'in dir:', dir)
  const { ext, name } = parse(base)
  const from = join(dir, base)
  const to = join(dir, `${name}.jpg`)
  const density = ext === '.pdf' ? `-density 600` : ''
  return new Promise((resolve, reject) => {
    log.info(
      'running convert:',
      `convert -auto-orient -append ${density} "${from}" "${to}"`
    )
    exec(`convert -auto-orient -append ${density} "${from}" "${to}"`, err =>
      err ? reject(err) : resolve(to)
    )
  })
}

export const rotate = (file: string, degrees: string): Promise<any> => {
  log.info('rotating')
  return new Promise((resolve, reject) => {
    log.info('running convert:', `convert ${file} -rotate '${degrees}' ${file}`)
    exec(`convert '${file}' -rotate '${degrees}' '${file}'`, err =>
      err ? reject(err) : resolve()
    )
  })
}

// archive recipe in s3
export const archive = (Key: string) => {
  const id = uuid()
  return new Promise((resolve, reject) => {
    exec(
      `s3cmd mv 's3://com-platezero-recipes/${Key}' 's3://com-platezero-recipe-archive/${id}'`,
      (err, stdout) => (err ? reject(err) : resolve(stdout))
    )
  })
}
