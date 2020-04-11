import { log, S3File } from './common'

const AWS = require('aws-sdk')
const fs = require('fs')
const uuidv4 = require('uuid/v4')

var s3 = new AWS.S3()
const os = require('os')
const path = require('path')

const docx = require('./extractors/docx')
const odt = require('./extractors/odt')
const pdf = require('./extractors/pdf')
const txt = require('./extractors/txt')

export async function load(file: S3File): Promise<string[]> {
  const filePath = path.join(os.tmpdir(), uuidv4())
  await downloadFile(filePath, file.bucket, file.key)
  let text = await loadText(filePath, file.originalname)
  fs.unlinkSync(filePath)
  return text
}

function downloadFile(filePath: string, bucketName: string, key: string) {
  return new Promise<any>((resolve, reject) => {
    var params = {
      Bucket: bucketName,
      Key: key
    }
    log(`Downloading ${filePath}`)
    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        fs.writeFileSync(filePath, data.Body)
        log('Downloaded')
        resolve(null)
      }
    })
  })
}

function loadText(filePath: string, originalname: string): Promise<string[]> {
  let ext = originalname
    .substring(originalname.lastIndexOf('.') + 1)
    .toLowerCase()
  switch (ext) {
    case 'docx':
      return docx.load(filePath)
    case 'odt':
      return odt.load(filePath)
    case 'pdf':
      return pdf.load(filePath)
    case 'txt':
      return txt.load(filePath)
    default:
      throw `Unsupported file type: ${ext}`
  }
}
