import { Response } from 'express'
import * as _ from 'lodash'

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
  return res.status(400).json({ errors: messages(errors) })
}

// HTTP 401 Unauthorized
export const unauthorized = (res: Response, error?: any) => {
  if (error) {
    console.error(error)
  }
  return res.status(401).json({ errors: ['unauthorized'] })
}

// HTTP 401 Unauthorized
export const invalidAuthentication = (res: Response) =>
  res.status(401).json({ errors: ['invalid username and/or password'] })

// HTTP 404 Not Found
export const notFound = (res: Response) =>
  res.status(404).json({ errors: ['not found'] })

// HTTP 500 Internal Server Error
export const internalServerError = (res: Response, error?: any) => {
  console.error(error || 'internal server error')
  return res.status(500).json({ errors: ['internal server error'] })
}
