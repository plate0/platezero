import * as express from 'express'
import * as next from 'next'
import { join } from 'path'
import * as prom from 'prom-client'
const { routes } = require('../routes')
const { sequelize } = require('../models')
import { api } from './api'
import { config } from './config'
import { HttpStatus } from '../common/http-status'

const app = next({ dev: config.dev })
const handler = routes.getRequestHandler(app)

app.prepare().then(() => {
  prom.collectDefaultMetrics({ timeout: 5000 })

  const server = express()

  server.use(express.static(join(__dirname, '..', 'static')))

  const apiLatency = new prom.Histogram({
    name: 'pz_api_latency',
    help: 'API latency',
    labelNames: ['method', 'code']
  })
  server.use(
    '/api',
    (req, res, next) => {
      const finish = apiLatency.startTimer({ method: req.method })
      res.on('finish', () => {
        finish({ code: res.statusCode })
      })
      next()
    },
    api
  )

  server.use(
    '/announcements',
    express.static(join(__dirname, '..', 'announcements'))
  )
  server.get('/_metrics', (req, res) => {
    const auth = req.headers.authorization
    if (!auth) {
      return res.status(HttpStatus.Unauthorized).end()
    }
    const [scheme, token] = auth.split(' ')
    if (!scheme || token !== 'eereexisahJeishiehahqu7eitei5eis') {
      return res.status(HttpStatus.Unauthorized).end()
    }
    return res.end(prom.register.metrics())
  })
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
