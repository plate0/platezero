import * as express from 'express'
import * as next from 'next'
import { join } from 'path'
import * as favicon from 'serve-favicon'
const { routes } = require('../routes')
const { sequelize } = require('../models')
import { api } from './api'
import { getConfig } from './config'

const cfg = getConfig()

const app = next({ dev: cfg.dev })
const handler = routes.getRequestHandler(app)

app.prepare().then(() => {
  const server = express()

  server.use(favicon(join(__dirname, '..', 'static', 'favicon.png')))
  server.use('/api', api)
  server.use(handler)

  sequelize
    .authenticate()
    .then(() => {
      server.listen(cfg.port, err => {
        if (err) throw err
        console.log(`> Ready on ${cfg.siteUrl}`)
      })
    })
    .catch(err => {
      console.error(`Error connecting to database: ${err}`)
    })
})
