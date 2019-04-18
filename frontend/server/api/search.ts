import * as express from 'express'
import { Recipe } from '../../models/recipe'
import { internalServerError } from '../errors'
const r = express.Router()

export const searchQuery = (q?: string, user_id?: number) => {
  const or = q
    ? {
        $or: {
          title: {
            $ilike: `%${q}%`
          },
          description: {
            $ilike: `%${q}%`
          }
        }
      }
    : {}
  const user = user_id ? { user_id } : {}
  return {
    where: {
      ...or,
      ...user
    }
  }
}

r.get('/', async (req, res) => {
  const { q, user_id } = req.query
  try {
    const results = await Recipe.findAll(searchQuery(q, user_id))
    return res.json(results)
  } catch (err) {
    return internalServerError(res, err)
  }
})

export const search = r
