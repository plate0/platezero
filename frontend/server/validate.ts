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
        .items({
          quantity_numerator: Joi.number(),
          quantity_denominator: Joi.number(),
          name: Joi.string().required(),
          unit: Joi.string(),
          preparation: Joi.string(),
          optional: Joi.boolean().required()
        })
        .required()
    })
    .required(),
  procedure_lists: Joi.array()
    .items({
      name: Joi.string(),
      lines: Joi.array()
        .required()
        .items({
          text: Joi.string().required(),
          image_url: Joi.string(),
          title: Joi.string()
        })
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
    .email({ minDomainAtoms: 2 })
    .required(),
  password: Joi.string()
    .min(8)
    .required()
})
