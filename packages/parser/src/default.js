const { dom, mapValues } = require('./parser')
const html = require('./html')

const yld = ($) => {
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

const preheats = html.preheats('body')

const ingredient_lists = ($) => {
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

const procedure_lists = ($) => {
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

const DefaultParser = mapValues({
  ...html.defaults,
  ...{
    yield: yld,
    preheats,
    ingredient_lists,
    procedure_lists,
  },
})

// Wrapper, future support for DOM parsers...
module.exports = dom(($, ...rest) => {
  // CHeck dom for known strings
  // and use dom specific parsers for those
  return DefaultParser($, ...rest)
})
