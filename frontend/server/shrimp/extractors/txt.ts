const fs = require('fs')

export const load = async filename => {
  let p = new Promise<string[]>((resolve, reject) => {
    console.log(`Reading ${filename}`)
    fs.readFile(filename, { encoding: 'UTF-8' }, function(err, data) {
      if (err) {
        reject(err)
      }
      if (data) {
        resolve(data.split('\n'))
        console.log('Done')
      } else {
        reject('No data')
      }
    })
  })
  let out = await p
  return out
}
