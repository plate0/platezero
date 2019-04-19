import * as html from './html'
import { mapValues } from './importer'

const ingredient_lists = html.ingredient_lists(
  'article.recipe section.recipe-section > ol li'
)
const procedure_lists = html.procedure_lists(
  'article.recipe > div > section.recipe-section.recipe-section-directions > div > ol li'
)

export const Popsugar = mapValues(
  html.defaults({
    ingredient_lists,
    procedure_lists
  })
)
