import * as express from 'express'
import * as _ from 'lodash'
import { RecipeVersionJSON } from '../models'
import { notFound, internalServerError } from './errors'

const plainText = (r: RecipeVersionJSON) => `${r.recipe.title}`

const r = express.Router()

const getRecipe = () =>
  Recipe.reload({
    include: [
      {
        model: RecipeBranch,
        attributes: ['name', 'recipe_version_id']
      },
      { model: User }
    ]
  })

r.get('/:username/:slug.txt', async (req, res) => {
  const { username, slug } = req.params
  try {
    const recipe = await getRecipe(username, slug)
    const masterBranch = _.head(
      _.filter(recipe.branches, r => r.name === 'master')
    )
    const versionId = _.get(masterBranch, 'recipe_version_id')
    const recipeVersion = getRecipeVersion(username, slug, versionId)
    console.log('recipe', recipeVersion)
    if (!recipeVersion) {
      return notFound(res)
    }
    res.send(plainText(recipeVersion))
  } catch (error) {
    return internalServerError(res, error)
  }
})

r.get('/:username/:slug/.txt', async (req, res) => {
  console.log('HEREEEEEEE', req, res)
})

export const exportRecipes = r
