const pdfReader = require('pdfreader')

module.exports = {
  load: async filename => {
    let p = new Promise((resolve, reject) => {
      let rdr = new pdfReader.PdfReader({ debug: 'true' })

      var mapOfRows = new Map() // indexed by [x-position, y-position]
      var pageWidth
      rdr.parseFileItems(filename, function(err, item) {
        if (err) {
          reject(err)
        } else if (!item) {
          resolve(transform(mapOfRows))
        } else if (item.page && item.width) {
          pageWidth = item.width
        } else if (item.text) {
          // accumulate text items into rows object, per line
          const key = [calcx(item.x, pageWidth), item.y]
          let row = mapOfRows.get(key)
          if (!row) {
            row = []
          }
          row.push(item.text)
          mapOfRows.set(key, row)
        }
      })
    })
    let text = await p
    return text
  }
}

// In order to deal with 2-column pages,
// 'x' is assumed to be 'column 0' if it
// is less than half the current page width,
// else 'column 1'.
// This may be overkill and/or inadequate
function calcx(x, pageWidth) {
  return x >= pageWidth / 2 ? 1 : 0
}

// Transform the map of position->text into
// an array of text rows, sorted by position
// such that all rows in column 0 precede all rows
// in column 1
function transform(mapOfRows) {
  let out = []
  Array.from(mapOfRows.keys())
    .sort((k1, k2) => {
      let n = parseFloat(k1[0]) - parseFloat(k2[0])
      if (n === 0) {
        n = parseFloat(k1[1]) - parseFloat(k2[1])
      }
      return n
    })
    .forEach(k => out.push(mapOfRows.get(k).join(' ')))
  return unify(out)
}

// Each item in a numbered list appears as 2 rows.
// E.g.
//      1. Line one
// appears as
//      1.
//      Line one
//
// Attempt to fix this
//
function unify(rows) {
  const rx = /^\d+[\.\)]\s*$/
  let out = []
  for (let i = 0; i < rows.length; ++i) {
    let row = rows[i]
    if (rx.test(row)) {
      row += ' ' + rows[++i]
    }
    out.push(row)
  }
  return out
}
