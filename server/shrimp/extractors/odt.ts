import { Section } from '../common'

const ELEMENT_NODE = 1,
  TEXT_NODE = 3

export const load = async filename => {
  const AdmZip = require('adm-zip')
  const cheerio = require('cheerio')

  // Read content.xml from ODF document
  const zip = new AdmZip(filename)
  const xml = zip.readAsText('content.xml')
  const scrubbedXml = scrubXml(xml)
  // Load xml DOM
  const $ = cheerio.load(scrubbedXml, {
    normalizeWhitespace: true,
    xmlMode: true
  })

  const body = $('office\\:body > office\\:text')
  return extractText($, $(body), 0)
}

function extractText($, node, depth) {
  let out = new Array()
  $(node)
    .contents()
    .each((_i, el) => {
      if (el.nodeType === ELEMENT_NODE) {
        switch (el.tagName) {
          case 'text:list':
          case 'text:p':
          case 'text:h':
          case 'text:section':
            out.push(Section)
            out = out.concat(extractText($, $(el), depth + 1))
            out.push(Section)
            break
          case 'text:list-item':
          case 'text:list-header':
            out.push($(el).text())
            break
          default:
            out = out.concat(extractText($, $(el), depth + 1))
            break
        }
      } else if (el.nodeType === TEXT_NODE) {
        let text = el.nodeValue
        out.push(text)
      }
    })
  return out
}

//Remove 'in-line' tags
function scrubXml(xml) {
  return xml
    .replace(/<text:span [^>]+>/gm, '')
    .replace(/<\/text:span>/gm, '')
    .replace(/<text:a [^>]+>/gm, '')
    .replace(/<\/text:a>/gm, '')
    .replace(/<text:s\/>/gm, ' ')
    .replace(/<text:tab\/>/gm, ' ')
}
