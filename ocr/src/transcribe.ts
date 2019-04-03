import { dom } from './parser/html'
import { OCR } from './parser/ocr'
import { Converter } from 'showdown'

const converter = new Converter()

const importer = dom(OCR)

export const markdown = (md: string) => converter.makeHtml(md)

export const parse = (html: string) => importer(html)

export const transcribe = (md: string) => parse(markdown(md))
