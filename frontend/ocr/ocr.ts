import * as vision from '@google-cloud/vision'
import { writeFileSync } from 'fs'

// https://cloud.google.com/vision/docs/detecting-fulltext
const ocr = async (file: string): Promise<string> => {
  const client = new vision.ImageAnnotatorClient({
    keyFilename: 'ocr/credentials.json'
  })
  const [result] = await client.documentTextDetection(file)
  console.log(result)
  const { text } = result.fullTextAnnotation
  return text
}

const main = async () => {
  const file = process.argv[2]
  if (!file) {
    console.log('Usage: yarn ocr <file.jpg>')
    process.exit(1)
  }
  try {
    const text = await ocr(`ocr/${file}`)
    writeFileSync('ocr/recipe.txt', text)
    console.log(text)
  } catch (err) {
    console.log(err)
  }
}

main()
