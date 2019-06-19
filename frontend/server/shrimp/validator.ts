import * as Joi from '@hapi/joi'
import * as _ from 'lodash'
import { NewRecipe } from '../validate'
import { PostRecipe } from '../../common/request-models'

export const validate = (data: PostRecipe): string[] => {
  const result = Joi.validate(data, NewRecipe, {
    abortEarly: false,
    convert: false,
    allowUnknown: false
  })
  if (result.error) {
    return _.map(result.error.details, 'message')
  }
  return []
}
