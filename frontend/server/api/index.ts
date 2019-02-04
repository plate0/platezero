import * as express from 'express'
import * as bodyParser from 'body-parser'

import { users } from './users'

const r = express.Router()
r.use(bodyParser.json())
r.use('/users', users)

r.get('/', (_, res) => {
  res.json({
    users_url: '/users'
  })
})

export const api = r
