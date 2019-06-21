// Copied from documentation at https://www.npmjs.com/package/multer-s3
export interface S3File {
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

export const Section = '§'

export function log(msg: Object) {
  console.log(
    `\x1b[94mShrimp:\x1b[0m ${
      'string' == typeof msg ? msg : JSON.stringify(msg)
    }`
  )
}
