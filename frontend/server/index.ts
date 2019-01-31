import * as express from 'express'
import * as next from 'next'
const { routes } = require('../routes')
const { sequelize } = require('../models')
import { api } from './api'

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handler = routes.getRequestHandler(app)

app.prepare().then(() => {
  const server = express()

  server.use('/api', api)
  server.use(handler)

  sequelize.authenticate().then(() => {
    server.listen(port, err => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  }).catch(err => {
    console.error(`Error connecting to database: ${err}`)
  })
})
