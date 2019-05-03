import { first, get, trim } from 'lodash'
import { mapValues } from './importer'
import {
  dom,
  recipeSchemaIngredientLists,
  recipeSchemaProcedureLists
} from './html'
import { AllHtmlEntities } from 'html-entities'
import * as cheerio from 'cheerio'
import { parseIngredient } from 'ingredient-parser'

const e = new AllHtmlEntities()
const decode = e.decode.bind(e)

const getPostContents = (json: any) => {
  return (
    get(first(json), 'data.children[0].data.selftext_html') ||
    get(json[1], 'data.children[0].data.body_html')
  )
}

const title = (json: any) => {
  return get(first(json), 'data.children[0].data.title')
}

const ingredient_lists = (json: any) => {
  const html = decode(getPostContents(json))
  const $ = cheerio.load(html)
  const ordered = $('ol')
  const unordered = $('ul')
  let lines = []
  if (unordered.get().length >= 1) {
    lines = unordered
      .first()
      .find('li')
      .map(function() {
        return parseIngredient(trim($(this).text()))
      })
      .get()
  } else {
    lines = ordered
      .first()
      .find('li')
      .map(function() {
        return parseIngredient(trim($(this).text()))
      })
      .get()
  }
  return [{ lines }]
}

const procedure_lists = (json: any) => {
  const html = decode(getPostContents(json))
  const $ = cheerio.load(html)
  return [
    {
      lines: $('ol')
        .last()
        .find('li')
        .map(function() {
          return trim($(this).text())
        })
        .get()
    }
  ]
}

export const RedditRecipes = mapValues({
  title,
  ingredient_lists,
  procedure_lists
})
