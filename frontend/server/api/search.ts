import * as express from 'express'
import { Recipe } from '../../models/recipe'
import { internalServerError } from '../errors'

const r = express.Router()

// Global unscoped search
r.get('/', async (req, res) => {
  const { q } = req.query
  try {
    const results = await Recipe.findAll({
      where: {
        $or: [
          {
            title: {
              $substring: q
            },
            description: {
              $substring: q
            }
          }
        ]
      }
    })
    return res.json(results)
  } catch (err) {
    return internalServerError(res, err)
  }
})

export const search = r
