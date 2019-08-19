import * as express from 'express'
import { Request } from 'express'
import * as _ from 'lodash'

import { RecipeDuration } from '../../../../models'
import { User } from '../../../../models/user'
import { Recipe } from '../../../../models/recipe'
import { RecipeVersion } from '../../../../models/recipe_version'
import { RecipeBranch } from '../../../../models/recipe_branch'
import { RecipeYield } from '../../../../models/recipe_yield'
import { ProcedureList } from '../../../../models/procedure_list'
import { ProcedureLine } from '../../../../models/procedure_line'
import { Preheat } from '../../../../models/preheat'
import { IngredientList } from '../../../../models/ingredient_list'
import { IngredientLine } from '../../../../models/ingredient_line'
import { Note } from '../../../../models/note'
import { notFound, internalServerError } from '../../../errors'

const r = express.Router()

export interface RecipeRequest extends Request {
  user: User
  recipe: Recipe
}

r.get('/', async function getRecipe(req: RecipeRequest, res) {
  try {
    const recipe = await Recipe.findOne({
      where: { id: req.recipe.id },
      include: [
        {
          model: RecipeBranch,
          attributes: ['name', 'recipe_version_id']
        },
        { model: User }
      ]
    })
    return res.json(recipe)
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.get('/versions', async function getRecipeVersions(req: RecipeRequest, res) {
  try {
    return res.json(
      await RecipeVersion.findAll({
        where: { recipe_id: req.recipe.id },
        order: [['created_at', 'DESC']],
        include: [{ model: User }]
      })
    )
  } catch (error) {
    return internalServerError(res, error)
  }
})

r.get('/notes', async function getRecipeNotes(req: RecipeRequest, res) {
  try {
    return res.json(
      await Note.findAll({
        where: { recipe_id: req.recipe.id },
        order: [['created_at', 'DESC']]
      })
    )
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.get('/versions/:id', async function getRecipeVersion(
  req: RecipeRequest,
  res
) {
  const id = parseInt(req.params.id, 10)
  const l = RecipeVersion.sequelize.literal
  try {
    const recipeVersion = await RecipeVersion.findOne({
      where: { id, recipe_id: req.recipe.id },
      attributes: ['id', 'created_at', 'message', 'parent_recipe_version_id'],
      order: [
        l('"ingredientLists.RecipeVersionIngredientList.sort_key" ASC'),
        l('"ingredientLists.lines.IngredientListLine.sort_key" ASC'),

        l('"procedureLists.RecipeVersionProcedureList.sort_key" ASC'),
        l('"procedureLists.lines.ProcedureListLine.sort_key" ASC')
      ],
      include: [
        {
          model: Recipe,
          include: [
            { model: RecipeBranch, attributes: ['name', 'recipe_version_id'] }
          ]
        },
        { model: User },
        { model: RecipeYield },
        { model: RecipeDuration },
        {
          model: Preheat,
          through: { attributes: [] }
        },
        {
          model: ProcedureList,
          attributes: ['id', 'name'],
          through: { attributes: [] },
          include: [
            {
              model: ProcedureLine,
              through: { attributes: [] }
            }
          ]
        },
        {
          model: IngredientList,
          attributes: ['id', 'name', 'image_url'],
          through: { attributes: [] },
          include: [
            {
              model: IngredientLine,
              through: { attributes: [] }
            }
          ]
        }
      ]
    })
    if (!recipeVersion) {
      return notFound(res)
    }
    console.log(
      `\x1b[97mgetRecipeVersion: procedureLists=${JSON.stringify(
        recipeVersion.procedureLists
      )}\x1b[0m`
    )
    return res.json(recipeVersion)
  } catch (error) {
    return internalServerError(res, error)
  }
})

export const recipe = r
