import { parse } from '../../common/ingredient'
import { trim } from 'lodash'
import {
  ProcedureListJSON,
  IngredientListJSON,
  PreheatJSON
} from '../../models'
//
// Helpful importing methods for HTML pages
//

// Get the text for a CSS selector
export const text = ($: any, sel: string) =>
  $(sel)
    .text()
    .trim()

export const title = ($: any) => {
  let title = trim($('meta[name="twitter:title"]').attr('content'))
  if (title) {
    return title
  }
  title = trim($('meta[property="og:title"]').attr('content'))
  if (title) {
    return title
  }
  return text($, 'title')
}

export const description = ($: any, sel?: string) => {
  if (sel) {
    return text($, sel)
  }
  let description = trim(
    $('meta[property="twitter:description"]').attr('content')
  )
  if (description) {
    return description
  }
  description = trim($('meta[property="og:description"]').attr('content'))
  if (description) {
    return description
  }
  description = trim($('meta[itemprop="description"]').attr('content'))
  if (description) {
    return description
  }
  return undefined
}

export const image_url = ($: any, sel?: string) => {
  if (sel) {
    return $(sel).attr('src')
  }
  let image = $('meta[property="twitter:image"]').attr('content')
  if (image) {
    return image
  }
  image = $('meta[property="og:image"]').attr('content')
  if (image) {
    return image
  }
  image = $('article img')
    .first()
    .attr('src')
  if (image) {
    return image
  }
  return $('main img')
    .first()
    .attr('src')
}

// https://regex101.com/r/xqkIKF/1
export const preheats = ($: any, sel?: string): PreheatJSON[] => {
  const utilities = ['oven', 'sous vide', 'stove']
  const regex = new RegExp(
    `(${utilities.join('|')})\\s[a-z]*\\s?(\\d+)\\s?(degrees|º|°)?\\s?(C|F)`,
    'gim'
  )
  const preheats: PreheatJSON[] = []
  let m
  const text = sel ? $(sel).text() : $.text()
  while ((m = regex.exec(text)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    preheats.push({
      name: m[1],
      temperature: parseInt(m[2]),
      unit: m[4] //TODO: Default to user preference?
    })
  }
  return preheats
}

export const ingredients = ($: any, sel: string): IngredientListJSON[] => [
  {
    lines: $(sel)
      .map(function() {
        return parse(trim($(this).text()))
      })
      .get()
  }
]

export const procedure_lists = ($: any, sel: string): ProcedureListJSON[] => [
  {
    lines: $(sel)
      .map(function() {
        return { text: trim($(this).text()) }
      })
      .get()
  }
]
