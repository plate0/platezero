import * as html from './html'
import { mapValues } from './importer'

const procedure_lists = html.procedure_lists('#method ol li')
const ingredient_lists = html.ingredient_lists('.recipe-ingredients ul li')

export const DeliciousMagazine = mapValues(
  html.defaults({
    ingredient_lists,
    procedure_lists
  })
)
