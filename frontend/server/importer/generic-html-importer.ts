import { Importer, fetchHTML, isUrl } from './importer'
import * as cheerio from 'cheerio'
import { PostRecipe } from '../../common/request-models'
import { parse } from '../../common/ingredient'
import { IngredientListJSON, ProcedureListJSON } from '../../models'

const title = ($: any) => {
  let title = $('meta[property="og:title"]')
    .attr('content')
    .trim()
  if (title) {
    return title
  }
  return undefined
}

const description = ($: any) => {
  let description = $('meta[property="og:description"]')
    .attr('content')
    .trim()
  if (description) {
    return description
  }
  return undefined
}

const image_url = ($: any) => {
  let image = $('meta[property="og:image"]')
    .attr('content')
    .trim()
  if (image) {
    return image
  }
}

const getYield = ($: any) => {
  const regex = /(serves|makes)\s([\d-]*)/gim
  const match = regex.exec($.text())
  if (match && match[2]) {
    return match[2].trim()
  }
  return undefined
}

const duration = ($: any) => {
  const regex = /(duration|takes|time)\s([\d]*)/gim
  const match = regex.exec($.text())
  if (match && match[2]) {
    return 0
    //    return match[2].trim()
  }
  return undefined
}

const ingredient_lists = ($: any): IngredientListJSON[] => {
  const lines = $('*')
    .filter(function() {
      return /^ingredients$/gim.test(
        $(this)
          .text()
          .trim()
      )
    })
    .first()
    .next()
    .closest('ul')
    .find('li')
    .map(function() {
      return parse($(this).text())
    })
    .get()
  return [{ lines }]
}

const procedure_lists = ($: any): ProcedureListJSON[] => {
  const lines = $('*')
    .filter(function() {
      return /^instructions$/gim.test(
        $(this)
          .text()
          .trim()
      )
    })
    .first()
    .next()
    .closest('ol')
    .find('li')
    .map(function() {
      return { text: $(this).text() }
    })
    .get()
  return [{ lines }]
}

//
export const GenericHTMLImporter: Importer = async (
  source: any
): Promise<PostRecipe> => {
  let raw
  if (isUrl(source)) {
    raw = await fetchHTML(source)
  } else {
    raw = source
  }
  const $ = cheerio.load(raw)
  return {
    title: title($),
    // subtitle: subtitle($),
    description: description($),
    image_url: image_url($),
    source_url: source as string,
    yield: getYield($),
    duration: duration($),
    // preheats: preheats($),
    ingredient_lists: ingredient_lists($),
    procedure_lists: procedure_lists($)
  }
}
