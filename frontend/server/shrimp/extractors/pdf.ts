import { Section } from '../common'

const pdfReader = require('pdfreader')

module.exports = {
  load: async filename => {
    let p = new Promise((resolve, reject) => {
      let rdr = new pdfReader.PdfReader({ debug: 'true' })

      var mapOfItems = new Map<Key, Item>() // indexed by [column, y-position, x-position]
      var pageWidth

      // Read the file and pass each 'item' to 'cb'
      rdr.parseFileItems(filename, function cb(err, item) {
        if (err) {
          // Reject on error
          reject(err)
        } else if (!item) {
          // Null item indicates end of file; resolve
          resolve(transform(mapOfItems))
        } else if (item.page && item.width) {
          // This item is a page, save the width
          pageWidth = item.width
        } else if (item.text) {
          // This item has text; extract it
          if (item.x > 0 && item.y > 0) {
            const key = new Key(pageWidth, item.x, item.y)
            mapOfItems.set(key, item)
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
function transform(mapOfItems: Map<Key, Item>): string[] {
  let out = []
  Array.from(mapOfItems.keys())
    .sort((k1, k2) => {
      return k1.column - k2.column || k1.y - k2.y || k1.x - k2.x
    })
    .forEach(k => out.push({ key: k, item: mapOfItems.get(k) }))
  return unify(out)
}

/**
 * Each row of text may appear split into several snippets within the input;
 * each will have the same 'y' value, but differing 'x' values.
 * This function consolidates these snippets into one row of text.
 *
 * @todo Try to figure out which contiguous lines constitute a paragraph and join them together
 *
 * @param {KeyedItem[]}   an array of {key:, item:} where key is {column:, x:, y:}
 * @return {string[]}
 */
function unify(input: KeyedItem[]): string[] {
  let out = []
  let previous: Item
  for (let i = 0; i < input.length; ) {
    let item = input[i].item
    if (i > 0 && !haveSameStyle(previous, item)) {
      out.push(Section)
    }
    previous = item
    let text = ''
    for (
      let row = input[i], y = row.key.y;
      i < input.length && row.key.y == y;
      row = input[++i]
    ) {
      text += ' ' + input[i].item.text
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

interface Item {
  x: number // x position
  y: number // y position
  w: number // width
  sw: number // font space width, use to merge adjacent text blocks
  clr: number // colour id
  A: string // alignment (left, right, center)
  R: [
    {
      // array of text runs
      T: string // flash_encoded text
      RA: any // rotation
      S: number // style id
      TS: number[] // [faceIdx, fontSize, bold?1:0, italic?1:0]
    }
  ]
  text: string // text content
}

class KeyedItem {
  key: Key
  item: Item
  constructor(key, item) {
    this.key = key
    this.item = item
  }
}

// Copied from https://github.com/modesty/pdf2json/lib/pdffont.js
function haveSameStyle(t1, t2) {
  let retVal = t1.R[0].S === t2.R[0].S
  if (retVal && t1.R[0].S < 0) {
    for (let i = 0; i < t1.R[0].TS.length; i++) {
      if (t1.R[0].TS[i] !== t2.R[0].TS[i]) {
        retVal = false
        break
      }
    }
  }
  if (retVal) {
    // make sure both block are not rotated
    retVal =
      typeof t1.R[0].RA === 'undefined' && typeof t2.R[0].RA === 'undefined'
  }

  return retVal
}
