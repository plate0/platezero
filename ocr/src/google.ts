import * as _ from 'lodash'

const key = 'AIzaSyBIDJaEwHLX1nZtxeuYoiWjKTQ-S8oTZng'

export const ocr = async (buffer: Buffer): Promise<string> => {
  const res = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${key}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: buffer.toString('base64')
            },
            features: [
              {
                type: 'DOCUMENT_TEXT_DETECTION'
              }
            ]
          }
        ]
      })
    }
  )

  const json = await res.json()
  console.log('json', json)
  const error = _.get(json, 'responses[0].error.message')
  if (error) {
    throw new Error(error)
  }
  return json.responses[0].fullTextAnnotation.text
}
