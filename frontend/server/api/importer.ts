import * as express from 'express'
import * as Importers from '../importer'
import { AuthenticatedRequest } from './user'
import { Recipe } from '../../models/recipe'
import { internalServerError } from '../errors'

const r = express.Router()

r.post('/url', async (req: AuthenticatedRequest, res) => {
  try {
    const importer = Importers.url(req.body.url)
    const recipe = await importer(req.body.url)
    recipe.source_url = req.body.url
    return res
      .status(201)
      .json(await Recipe.createNewRecipe(req.user.userId, recipe))
  } catch (err) {
    return internalServerError(res, err)
  }
})

export const importers = r
