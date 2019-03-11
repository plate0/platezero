import * as express from 'express'
import * as Importers from '../importer'
import { AuthenticatedRequest } from './user'
import { Recipe } from '../../models/recipe'

const r = express.Router()

r.post('/url', async (req: AuthenticatedRequest, res) => {
  const importer = Importers.url(req.body.url)
  const html = await fetch(req.body.url).then(res => {
    if (res.status >= 400) {
      throw new Error('error fetching recipe')
    }
    return res.text()
  })
  importer.setup(html)
  const recipe = await importer.recipe()

  try {
    return res
      .status(201)
      .json(await Recipe.createNewRecipe(req.user.userId, recipe))
  } catch (error) {
    return res.status(500).json({ error })
  }
})

export const importers = r
