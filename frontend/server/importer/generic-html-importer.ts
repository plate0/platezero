import { mapValues } from './importer'
import { IngredientListJSON, ProcedureListJSON } from '../../models'
import * as html from './html'

const yld = ($: any) => {
  const schemaYield = html.recipeSchemaYield($)
  if (schemaYield) {
    return schemaYield
  }
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
  let lines = html.recipeSchemaIngredientLists($)
  if (lines.length !== 0) {
    return [{ lines }]
  }
  lines = html.plateZeroIngredientLists($)
  if (lines.length !== 0) {
    return [{ lines }]
  }
  return undefined
}

const procedure_lists = ($: any): ProcedureListJSON[] => {
  let lines = html.recipeSchemaProcedureLists($)
  if (lines.length > 0) {
    return [{ lines }]
  }
  lines = html.plateZeroProcedureLists($)
  if (lines.length > 0) {
    return [{ lines }]
  }
  return undefined
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
