import * as Joi from 'joi'
import { Request, Response } from 'express'
import * as _ from 'lodash'

const validator = schema => {
  return (req: Request, res: Response, next) => {
    const result = Joi.validate(req.body, schema, {
      abortEarly: false,
      convert: false,
      allowUnknown: false
    })
    if (result.error) {
      return res
        .status(400)
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

const procedureLine = Joi.object({
  id: Joi.number().min(0),
  text: Joi.string().required(),
  image_url: Joi.string(),
  title: Joi.string()
})

const procedureList = Joi.object({
  name: Joi.string(),
  lines: Joi.array()
    .required()
    .items(procedureLine)
})

export const validateNewRecipe = validator({
  title: Joi.string().required(),
  subtitle: Joi.string(),
  description: Joi.string(),
  image_url: Joi.string().uri(),
  source_url: Joi.string().uri(),
  yield: Joi.string(),
  duration: Joi.number(),
  preheats: Joi.array().items({
    name: Joi.string().required(),
    temperature: Joi.number()
      .min(0)
      .required(),
    unit: Joi.string()
      .valid('C', 'F')
      .required()
  }),
  ingredient_lists: Joi.array()
    .items({
      name: Joi.string(),
      image_url: Joi.string(),
      lines: Joi.array()
        .items(ingredientLine)
        .required()
    })
    .required(),
  procedure_lists: Joi.array()
    .items(procedureList)
    .required()
})

export const validateNewUser = validator({
  username: Joi.string()
    .regex(/[a-zA-Z][a-zA-Z0-9\-_]+/)
    .min(2)
    .max(25)
    .required(),
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),
  password: Joi.string()
    .min(8)
    .required()
})

export const validateRecipePatch = validator({
  message: Joi.string().required(),
  changedIngredientLists: Joi.array().items({
    ingredientListId: Joi.number()
      .min(0)
      .required(),
    removedIngredientIds: Joi.array()
      .items(Joi.number())
      .required(),
    changedIngredients: Joi.array()
      .items(ingredientLine)
      .required(),
    addedIngredients: Joi.array()
      .items(ingredientLine)
      .required()
  }),
  addedProcedureLists: Joi.array().items(procedureList),
  changedProcedureLists: Joi.array().items({
    procedureListId: Joi.number()
      .min(0)
      .required(),
    removedStepIds: Joi.array()
      .items(Joi.number())
      .required(),
    changedSteps: Joi.array()
      .items(procedureLine)
      .required(),
    addedSteps: Joi.array()
      .items(procedureLine)
      .required()
  }),
  removedProcedureListIds: Joi.array().items(Joi.number())
})
