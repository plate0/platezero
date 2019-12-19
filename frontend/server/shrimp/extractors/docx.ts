export const load = async filename => {
  const AdmZip = require('adm-zip')
  const cheerio = require('cheerio')
  // Read document.xml from docx document
  const zip = new AdmZip(filename)
  const xml = zip.readAsText('word/document.xml')
  // Load xml DOM
  const $ = cheerio.load(xml, {
    normalizeWhitespace: true,
    xmlMode: true
  })
  let out = new Array()
  $('w\\:t').each((_i, el) => {
    out.push($(el).text())
  })
  return out
}
