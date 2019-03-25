import { mapValues } from './importer'
import { parse } from '../../common/ingredient'
import { IngredientListJSON, ProcedureListJSON } from '../../models'
import * as html from './html'

const yld = ($: any) => {
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

const preheats = html.preheats('body')

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

export const GenericHTML = mapValues(
  html.defaults({
    yield: yld,
    duration,
    preheats,
    ingredient_lists,
    procedure_lists
  })
)
