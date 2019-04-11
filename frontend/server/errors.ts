import { Response } from 'express'
import * as _ from 'lodash'
import { HttpStatus } from '../common/http-status'

const messages = (e?: string | string[] | Error): string[] => {
  if (_.isError(e)) {
    return [e.message]
  }
  if (_.isString(e)) {
    return [e]
  }
  if (_.isArray(e)) {
    return _.filter(e, _.isString)
  }
  return []
}

// HTTP 400 Bad Request
export const badRequest = (
  res: Response,
  errors?: string | string[] | Error
) => {
  return res.status(HttpStatus.BadRequest).json({ errors: messages(errors) })
}

// HTTP 401 Unauthorized
export const unauthorized = (res: Response, error?: any) => {
  if (error) {
    console.error(error)
  }
  return res.status(HttpStatus.Unauthorized).json({ errors: ['unauthorized'] })
}

// HTTP 401 Unauthorized
export const invalidAuthentication = (
  res: Response,
  message = 'invalid username and/or password'
) => res.status(HttpStatus.Unauthorized).json({ errors: [message] })

// HTTP 404 Not Found
export const notFound = (res: Response) =>
  res.status(HttpStatus.NotFound).json({ errors: ['not found'] })

// HTTP 500 Internal Server Error
export const internalServerError = (res: Response, error?: any) => {
  console.error(error || 'internal server error')
  return res
    .status(HttpStatus.InternalServerError)
    .json({ errors: ['internal server error'] })
}
