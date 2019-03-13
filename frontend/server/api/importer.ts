import fetch from 'node-fetch'
import * as express from 'express'
import * as Importers from '../importer'
import { AuthenticatedRequest } from './user'
import { Recipe } from '../../models/recipe'
import { internalServerError } from '../errors'

const r = express.Router()

r.post('/url', async (req: AuthenticatedRequest, res) => {
  try {
    console.log('Req Body', req.body)
    const importer = Importers.url(req.body.url)
    const html = await fetch(req.body.url).then(res => {
      if (res.status >= 400) {
        throw new Error('error fetching recipe')
      }
      return res.text()
    })
    importer.setup(html)
    const recipe = await importer.recipe()
    console.log('PARSED', recipe)
    return res
      .status(201)
      .json(await Recipe.createNewRecipe(req.user.userId, recipe))
  } catch (err) {
    return internalServerError(res, err)
  }
})

export const importers = r
