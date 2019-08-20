import * as express from 'express'
import { User, PlannedRecipe, Recipe, sequelize } from '../../models'
import { badRequest, internalServerError, notFound } from '../errors'
import { validateMealplanRequest, validateNewPlannedRecipe } from '../validate'
import { HttpStatus } from '../../common/http-status'

export const mealplan = express.Router()

interface MPR extends express.Request {
  user: User
}

mealplan.get('/', validateMealplanRequest, async function getPlannedRecipes(
  req: MPR,
  res
) {
  try {
    const { until } = req.query
    const meals = await PlannedRecipe.findAll({
      where: {
        [sequelize.Op.and]: [
          { user_id: req.user.id },
          {
            plan_date: {
              [sequelize.Op.lte]: until
                ? until
                : sequelize.literal("now() + '7d'::interval")
            }
          }
        ]
      },
      include: [{ model: Recipe }],
      order: [['plan_date', 'ASC']]
    })
    return res.json(meals)
  } catch (err) {
    return internalServerError(res, err)
  }
})

mealplan.post('/', validateNewPlannedRecipe, async function createPlannedRecipe(
  req: MPR,
  res
) {
  try {
    const id = req.query.recipe_id
    const user_id = req.user.id
    const recipe = await Recipe.findOne({ where: { id } })
    if (!recipe) {
      return badRequest(res)
    }
    const plan = await PlannedRecipe.create({
      user_id,
      recipe_id: recipe.id,
      plan_date: req.body.plan_date
    })
    return res.json(plan)
  } catch (err) {
    return internalServerError(res, err)
  }
})

mealplan.delete('/:id', async function removePlannedRecipe(req: MPR, res) {
  try {
    const { id } = req.params
    const user_id = req.user.id
    const plan = await PlannedRecipe.findOne({ where: { id, user_id } })
    if (!plan) {
      return notFound(res)
    }
    await plan.destroy()
    return res.status(HttpStatus.NoContent).end()
  } catch (err) {
    return internalServerError(res, err)
  }
})
