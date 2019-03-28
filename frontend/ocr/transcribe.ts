// markdown to html
//
// pasre html
//
import * as marked from 'marked'
import { dom } from '../server/importer/html'
import { OCR } from '../server/importer/ocr'
import { readFileSync, writeFileSync } from 'fs'

const { argv } = require('yargs')
  .default('i', 'ocr/recipe.md')
  .default('o', 'ocr/recipe.json')

const importer = dom(OCR)

const markdown = (md: string) => marked(md)

const parse = (html: string) => importer(html)

const main = () => {
  const { i, o } = argv
  const data = readFileSync(i, { encoding: 'utf8' })
  console.log(data)
  const transformed = parse(markdown(data))
  writeFileSync(o, JSON.stringify(transformed, null, 2))
}

main()
