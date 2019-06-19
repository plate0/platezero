const AWS = require('aws-sdk')
const s3 = new AWS.S3()

export async function archive(file: S3File) {
  await copy(file)
  await remove(file)
}

async function copy(file: S3File) {
  const promise = new Promise<String>((resolve, reject) => {
    const params = {
      Bucket: 'com-platezero-recipe-archive',
      CopySource: file.bucket + '/' + file.key,
      Key: file.key
    }
    s3.copyObject(params, function(err, _data) {
      if (err) {
        reject(new Error(err))
      } else {
        resolve(null)
      }
    })
  })
  return promise
}

async function remove(file: S3File) {
  const promise = new Promise<String>((resolve, reject) => {
    const params = {
      Bucket: file.bucket,
      Key: file.key
    }
    s3.deleteObject(params, function(err, _data) {
      if (err) {
        reject(new Error(err))
      } else {
        resolve(null)
      }
    })
  })
  return promise
}
