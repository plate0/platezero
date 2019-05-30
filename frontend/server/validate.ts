import * as Joi from '@hapi/joi'
import { Request, Response } from 'express'
import * as _ from 'lodash'
import { HttpStatus } from '../common/http-status'

const requestBodyGetter = (req: Request) => req.body
const requestQueryGetter = (req: Request) => req.query

const validator = (schema, objectGetter?: (req: Request) => object) => {
  if (!objectGetter) {
    objectGetter = requestBodyGetter
  }
  return (req: Request, res: Response, next) => {
    const result = Joi.validate(objectGetter(req), schema, {
      abortEarly: false,
      convert: false,
      allowUnknown: false
    })
    if (result.error) {
      return res
        .status(HttpStatus.BadRequest)
        .json({ errors: _.map(result.error.details, 'message') })
    }
    next()
  }
}

const ingredientLine = Joi.object({
  id: Joi.number(),
  quantity_numerator: Joi.number(),
  quantity_denominator: Joi.number(),
  name: Joi.string().required(),
  unit: Joi.string().allow(''),
  preparation: Joi.string().allow(''),
  optional: Joi.boolean().required()
})

const ingredientList = Joi.object({
  id: Joi.number().min(0),
  name: Joi.string(),
  image_url: Joi.string(),
  lines: Joi.array()
    .items(ingredientLine)
    .required()
})

const procedureLine = Joi.object({
  id: Joi.number().min(0),
  text: Joi.string().required(),
  image_url: Joi.string(),
  title: Joi.string()
})

const procedureList = Joi.object({
  id: Joi.number().min(0),
  name: Joi.string(),
  lines: Joi.array()
    .required()
    .items(procedureLine)
})

const preheat = Joi.object({
  id: Joi.number().min(0),
  name: Joi.string().required(),
  temperature: Joi.number()
    .min(0)
    .required(),
  unit: Joi.string()
    .valid('C', 'F')
    .required()
})

export const validateNewRecipe = validator({
  title: Joi.string().required(),
  subtitle: Joi.string(),
  description: Joi.string(),
  image_url: Joi.string().uri(),
  source_url: Joi.string().uri(),
  source_author: Joi.string(),
  source_isbn: Joi.string(),
  source_title: Joi.string(),
  yield: Joi.string(),
  duration: Joi.number(),
  preheats: Joi.array().items(preheat),
  ingredient_lists: Joi.array()
    .items(ingredientList)
    .required(),
  procedure_lists: Joi.array()
    .items(procedureList)
    .required()
})

export const validateNewUser = validator({
  username: Joi.string()
    .regex(/^[a-zA-Z][a-zA-Z0-9\-_]+$/)
    .min(2)
    .max(25)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),
  password: Joi.string()
    .min(8)
    .required()
})

export const validateRecipeVersionPatch = validator({
  message: Joi.string().required(),
  ingredientLists: Joi.array().items(ingredientList),
  procedureLists: Joi.array().items(procedureList),
  preheats: Joi.array().items(preheat),
  recipeYield: Joi.object({
    id: Joi.number().min(0),
    text: Joi.string().required()
  }),
  recipeDuration: Joi.object({
    id: Joi.number().min(0),
    duration_seconds: Joi.number()
      .min(0)
      .required()
  })
})

export const validateRecipePatch = validator({
  title: Joi.string(),
  subtitle: Joi.string().allow(''),
  description: Joi.string().allow(''),
  image_url: Joi.string()
    .uri()
    .allow(null),
  source_url: Joi.string()
    .allow(null)
    .allow(''),
  source_title: Joi.string()
    .allow(null)
    .allow(''),
  source_author: Joi.string()
    .allow(null)
    .allow(''),
  source_isbn: Joi.string()
    .allow(null)
    .allow('')
})

export const validateUserPatch = validator({
  name: Joi.string().allow(null),
  avatar_url: Joi.string()
    .uri()
    .allow(null)
})

export const validateNewNote = validator({
  recipe_id: Joi.number().required(),
  recipe_version_id: Joi.number().required(),
  text: Joi.string().required(),
  pinned: Joi.boolean()
})

export const validateNotePatch = validator({
  pinned: Joi.boolean(),
  text: Joi.string()
})

export const validateRecipeSearch = validator(
  {
    q: Joi.string().required(),
    username: Joi.string().required(),
    sort: Joi.string()
      .regex(/^(title|created_at)-(asc|desc)$/)
      .allow('')
      .optional()
  },
  requestQueryGetter
)

export const validateShoppingListPostPatch = validator({
  name: Joi.string().required()
})

export const validateShoppingListItemPost = validator({
  name: Joi.string().required()
})

export const validateShoppingListItemPatch = validator({
  name: Joi.string(),
  completed: Joi.boolean()
})
