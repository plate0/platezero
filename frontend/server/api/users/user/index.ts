import * as express from 'express'
import { Request } from 'express'
import * as _ from 'lodash'
import { User, Recipe, sortable } from '../../../../models'
import { RecipeRequest, recipe } from './recipe'
import { notFound, internalServerError } from '../../../errors'
const RecipeSortBy = sortable(Recipe, 'title')
const r = express.Router()

export interface UserRequest extends Request {
  user: User
}

r.get('/', async function getUser(req: UserRequest, res) {
  try {
    const recipes = await Recipe.findAll({
      where: { user_id: req.user.id },
      order: [['updated_at', 'DESC']],
      limit: 20
    })
    const user = await req.user.reload()
    const json = {
      ...user.toJSON(),
      recipes
    }
    return res.json(json)
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.get('/recipes', async function getUserRecipes(req: UserRequest, res) {
  const { sort } = req.query
  const order = [RecipeSortBy(_.split(sort, '-') || [])]
  try {
    return res.json(await Recipe.findAll({ order }))
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.use(
  '/recipes/:slug',
  async function populateRecipe(req: UserRequest, res, next) {
    const { slug } = req.params
    try {
      const recipe = await Recipe.findOne({
        where: { user_id: req.user.id, slug }
      })
      if (!recipe) {
        return notFound(res)
      }
      ;(req as RecipeRequest).recipe = recipe
      next()
    } catch (error) {
      return internalServerError(res, error)
    }
  },
  recipe
)

export const user = r
