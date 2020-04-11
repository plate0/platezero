import * as Joi from '@hapi/joi'
import * as _ from 'lodash'
import { ImportStatus } from './shrimp'
import { NewRecipe } from '../validate'
import { PostRecipe } from '../../common/request-models'
import { IngredientListJSON, ProcedureListJSON } from 'models'

export const validate = (
  data: PostRecipe
): { status: ImportStatus; errors: string } => {
  const result = Joi.validate(data, NewRecipe, {
    abortEarly: false,
    convert: false,
    allowUnknown: false
  })
  let status = ImportStatus.Unknown,
    errors
  if (result.error) {
    status = ImportStatus.Failed
    errors = _.map(result.error.details, 'message').join('\n')
  } else if (!validateListOfLists<IngredientListJSON>(data.ingredient_lists)) {
    status = ImportStatus.Incomplete
  } else if (!validateListOfLists<ProcedureListJSON>(data.procedure_lists)) {
    status = ImportStatus.Incomplete
  }

  return { status, errors }
}

interface Linear {
  lines: any[]
}
function validateListOfLists<T extends Linear>(listOfLists: Array<T>): boolean {
  return (
    listOfLists && listOfLists.length > 0 && listOfLists[0].lines.length > 0
  )
}
