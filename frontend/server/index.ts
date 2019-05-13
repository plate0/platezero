import * as express from 'express'
import * as next from 'next'
import { join } from 'path'
import * as prom from 'prom-client'
import * as _ from 'lodash'
const { routes } = require('../routes')
const { sequelize } = require('../models')
import { api } from './api'
import { config } from './config'
import { HttpStatus } from '../common/http-status'
import { notFound, internalServerError } from './errors'
import { Recipe } from '../models'

const app = next({ dev: config.dev })
const handler = routes.getRequestHandler(app, ({ req, res, route, query }) => {
  app.render(req, res, route.page, query)
})

app.prepare().then(() => {
  prom.collectDefaultMetrics({ timeout: 5000 })

  const server = express()

  server.use(express.static(join(__dirname, '..', 'static')))

  const httpDuration = new prom.Histogram({
    name: 'http_request_duration_seconds',
    help: 'How much time is spent receiving and responding to HTTP requests',
    labelNames: ['method', 'status', 'handler']
  })
  const httpCount = new prom.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'status', 'handler']
  })
  server.use((req, res, next) => {
    const method = req.method
    const finish = httpDuration.startTimer()
    res.on('finish', () => {
      const status = res.statusCode
      const handler = _.get(req, 'route.stack[0].name', '<undefined>')
      finish({ status, method, handler })
      httpCount.inc({ status, method, handler })
    })
    next()
  })

  server.use('/api', api)

  server.get('/:username/:slug.txt', async (req, res) => {
    console.log('HEREEEEEEE')
    const { slug } = req.params
    try {
      // find user?
      const recipe = await Recipe.findOne({
        where: { slug }
      })
      if (!recipe) {
        return notFound(res)
      }
      res.send(recipe.toString())
    } catch (error) {
      return internalServerError(res, error)
    }
  })

  server.get('/:username/:slug/.txt', async (req, res) => {
    console.log('HEREEEEEEE')
    const { slug } = req.params
    try {
      // find user?
      const recipe = await Recipe.findOne({
        where: { slug }
      })
      if (!recipe) {
        return notFound(res)
      }
      res.send(recipe.toString())
    } catch (error) {
      return internalServerError(res, error)
    }
  })

  server.use(
    '/announcements',
    express.static(join(__dirname, '..', 'announcements'))
  )
  server.get('/_metrics', function getPrometheusMetrics(req, res) {
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
