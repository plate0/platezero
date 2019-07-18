import * as Joi from '@hapi/joi'
import * as _ from 'lodash'
import { NewRecipe } from '../validate'
import { PostRecipe } from '../../common/request-models'
import { IngredientListJSON, ProcedureListJSON } from 'models'

export const validate = (data: PostRecipe): string[] => {
  const result = Joi.validate(data, NewRecipe, {
    abortEarly: false,
    convert: false,
    allowUnknown: false
  })
  const allErrors = result.error ? result.error : { details: [] }
  if (!validateListOfLists<IngredientListJSON>(data.ingredient_lists)) {
    allErrors.details.push({ message: 'No ingredients found' })
  }

  if (!validateListOfLists<ProcedureListJSON>(data.procedure_lists)) {
    allErrors.details.push({ message: 'No procedures found' })
  }

  if (allErrors.details.length) {
    return _.map(allErrors.details, 'message')
  }
  return []
}

interface Linear {
  lines: any[]
}
function validateListOfLists<T extends Linear>(listOfLists: Array<T>): boolean {
  return (
    listOfLists && listOfLists.length > 0 && listOfLists[0].lines.length > 0
  )
}
