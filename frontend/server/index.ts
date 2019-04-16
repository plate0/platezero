import * as express from 'express'
import * as next from 'next'
import { join } from 'path'
const { routes } = require('../routes')
const { sequelize } = require('../models')
import { api } from './api'
import { config } from './config'

const app = next({ dev: config.dev })
const handler = routes.getRequestHandler(app)

app.prepare().then(() => {
  const server = express()

  server.use(express.static(join(__dirname, '..', 'static')))
  server.use('/api', api)
  server.use(handler)

  sequelize
    .authenticate()
    .then(() => {
      server.listen(config.port, err => {
        if (err) throw err
        console.log(`> Ready on ${config.siteUrl}`)
      })
    })
    .catch(err => {
      console.error(`Error connecting to database: ${err}`)
    })
})
