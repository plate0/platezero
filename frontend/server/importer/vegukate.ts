import * as html from './html'
import { trim } from 'lodash'
import { mapValues } from './importer'
import { parseIngredient } from 'ingredient-parser'

const yld = ($: any) =>
  $('[itemprop="recipeInstructions"] h3')
    .first()
    .next('p')
    .text()

const ingredient_lists = ($: any) => [
  {
    lines: $('[itemprop="recipeInstructions"] h3')
      .first()
      .next('p')
      .next('p')
      .text()
      .split('\n')
      .map(parseIngredient)
  }
]

const procedure_lists = ($: any) => [
  {
    lines: $('[itemprop="recipeInstructions"] h3')
      .filter(html.where($, /Method:/))
      .nextUntil('h3')
      .map((_, e) => trim($(e).text()))
      .get()
  }
]

export const Vegukate = mapValues(
  html.defaults({
    yield: yld,
    ingredient_lists,
    procedure_lists
  })
)
