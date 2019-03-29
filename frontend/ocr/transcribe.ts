// markdown to html
//
// pasre html
//
import { dom } from '../server/importer/html'
import { OCR } from '../server/importer/ocr'
import { readFileSync, writeFileSync } from 'fs'
import { Converter } from 'showdown'
const converter = new Converter()

const { argv } = require('yargs')
  .default('i', 'ocr/recipe.md')
  .default('o', 'ocr/recipe.json')

const importer = dom(OCR)

const markdown = (md: string) => converter.makeHtml(md)

const parse = (html: string) => importer(html)

const main = () => {
  const { i, o } = argv
  const data = readFileSync(i, { encoding: 'utf8' })
  const transformed = parse(markdown(data))
  writeFileSync(o, JSON.stringify(transformed, null, 2))
}

main()
