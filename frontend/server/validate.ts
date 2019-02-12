import * as Joi from 'joi'
import { Request, Response } from 'express'

const validator = schema => {
  return (req: Request, res: Response, next) => {
    const result = Joi.validate(req.body, schema, {
      abortEarly: false,
      convert: false,
      allowUnknown: false
    })
    if (result.error) {
      return res.status(400).json({ error: result.error.details })
    }
    next()
  }
}

export const validateNewRecipe = validator({
  title: Joi.string().required(),
  image_url: Joi.string().uri(),
  source_url: Joi.string().uri(),
  yield: Joi.string(),
  oven_preheat_temperature: Joi.number().min(0),
  oven_preheat_unit: Joi.any().valid('C', 'F'),
  sous_vide_preheat_temperature: Joi.number().min(0),
  sous_vide_preheat_unit: Joi.any().valid('C', 'F'),
  ingredient_lists: Joi.array()
    .items({
      name: Joi.string(),
      ingredients: Joi.array()
        .items({
          quantity_numerator: Joi.number(),
          quantity_denominator: Joi.number(),
          name: Joi.string().required(),
          preparation: Joi.string(),
          optional: Joi.boolean()
        })
        .required()
    })
    .required(),
  procedure_lists: Joi.array()
    .items({
      name: Joi.string(),
      steps: Joi.array()
        .required()
        .items(Joi.string().required())
    })
    .required()
})

export const validateNewUser = validator({
  username: Joi.string()
    .regex(/[a-zA-Z][a-zA-Z0-9\-_]+/)
    .min(2)
    .max(25)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(8)
    .required()
})
