import { readFile } from 'fs'

export function testAsset(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    readFile(`test/assets/${path}`, { encoding: 'utf8' }, (err, content) => {
      if (err) {
        return reject(err)
      }
      return resolve(content)
    })
  })
}
