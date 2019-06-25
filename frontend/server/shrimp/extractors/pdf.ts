//import { log } from "../common";

const pdfReader = require('pdfreader')

module.exports = {
  load: async filename => {
    let p = new Promise((resolve, reject) => {
      let rdr = new pdfReader.PdfReader({ debug: 'true' })

      var mapOfRows = new Map() // indexed by [column, x-position, y-position]
      var pageWidth
      var debug = []
      rdr.parseFileItems(filename, function(err, item) {
        debug.push(item)
        if (err) {
          reject(err)
        } else if (!item) {
          //    log(debug)
          resolve(transform(mapOfRows))
        } else if (item.page && item.width) {
          pageWidth = item.width
        } else if (item.text) {
          if (item.x > 0 && item.y > 0) {
            const key = new Key(pageWidth, item.x, item.y)
            mapOfRows.set(key, item.text)
          }
        }
      })
    })
    let text = await p
    return text
  }
}

// Transform the map of position->text into
// an array of text rows, sorted by position
// such that all rows in column 0 precede all rows
// in column 1
function transform(mapOfRows: Map<Key, string>): string[] {
  let out = []
  Array.from(mapOfRows.keys())
    .sort((k1, k2) => {
      let n = k1.column - k2.column
      if (n === 0) {
        n = k1.y - k2.y
      }
      if (n === 0) {
        n = k1.x - k2.x
      }
      return n
    })
    .forEach(k => out.push({ key: k, text: mapOfRows.get(k) }))
  return unify(out)
}

/**
 * Each row of text may appear split into several snippets within the input;
 * each will have the same 'y' value, but differing 'x' values.
 * This function consolidates these snippets into one row of text.
 *
 * @todo Try to figure out which contiguous lines constitute a paragraph and join them together
 *
 * @param {KeyedText[]}   an array of {key:, text:} where key is {column:, x:, y:}
 * @return {string[]}
 */
function unify(input: KeyedText[]): string[] {
  let out = []
  for (let i = 0; i < input.length; ) {
    let text = ''
    for (
      let row = input[i], y = row.key.y;
      i < input.length && row.key.y == y;
      row = input[++i]
    ) {
      text += ' ' + input[i].text
    }
    out.push(text)
  }
  return out
}

class Key {
  x: number
  y: number
  column: number
  constructor(pageWidth: number, x: number, y: number) {
    this.column = x >= pageWidth / 2 ? 1 : 0
    this.x = x
    this.y = y
  }
}

class KeyedText {
  key: Key
  text: string
  constructor(key, text) {
    this.key = key
    this.text = text
  }
}
