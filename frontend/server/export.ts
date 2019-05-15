import * as express from 'express'
import * as _ from 'lodash'
import * as cheerio from 'cheerio'
import { Converter } from 'showdown'
import {
  User,
  Recipe,
  RecipeBranch,
  RecipeVersionJSON,
  IngredientList,
  IngredientLine,
  ProcedureList,
  ProcedureLine,
  RecipeDuration,
  Preheat,
  RecipeYield,
  RecipeVersion
} from '../models'
import { notFound, internalServerError } from './errors'
import Fraction from 'fraction.js'
const converter = new Converter()

const withNewline = (s: string | undefined) => (s ? s + '\n' : '')

const plainTextIngredients = (ingredient_lists: IngredientList[]) =>
  ingredient_lists
    .map(
      il =>
        withNewline(il.name) +
        il.lines
          .map(line => {
            const amount = new Fraction(
              line.quantity_numerator,
              line.quantity_denominator
            ).toFraction(true)
            return `* ${amount ? amount + ' ' : ''}${
              line.unit ? line.unit + ' ' : ''
            }${line.name}${line.preparation ? ', ' + line.preparation : ''}${
              line.optional ? ' (optional)' : ''
            }`
          })
          .join('\n')
    )
    .join('\n\n')

const markdownToPlainText = (s: string) =>
  cheerio
    .load(converter.makeHtml(s))
    .root()
    .text()

const plainTextProcedure = (procedure_lists: ProcedureList[]) =>
  procedure_lists
    .map(
      pl =>
        withNewline(pl.name) +
        pl.lines
          .map((line, i) => {
            return `${i + 1}. ${markdownToPlainText(line.text)}`
          })
          .join('\n')
    )
    .join('\n\n')

const plainText = (r: RecipeVersionJSON) => `${withNewline(
  r.recipe.title
)}${withNewline(r.recipe.subtitle)}
${withNewline(_.trim(r.recipe.description))}
Ingredients

${plainTextIngredients(r.ingredientLists)}

Instructions

${plainTextProcedure(r.procedureLists)}
`

const getUser = (username: string) => User.findByUsername(username)

const getRecipe = (user_id: number, slug: string) =>
  Recipe.findOne({
    where: { user_id, slug },
    include: [
      {
        model: RecipeBranch,
        attributes: ['name', 'recipe_version_id']
      },
      { model: User }
    ]
  })

const getRecipeVersion = (recipe_id, id) => {
  const l = RecipeVersion.sequelize.literal
  return RecipeVersion.findOne({
    where: { id, recipe_id },
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
}

const r = express.Router()
// Can do `.:format` and then
// https://expressjs.com/en/api.html#res.format
// to handle many formats
r.get('/:username/:slug.txt', async (req, res) => {
  const { username, slug } = req.params
  try {
    const user = await getUser(username)
    if (!user) {
      return notFound(res)
    }
    const recipe = await getRecipe(user.id, slug)
    if (!recipe) {
      return notFound(res)
    }
    const masterBranch = _.head(
      _.filter(recipe.branches, r => r.name === 'master')
    )
    const versionId = _.get(masterBranch, 'recipe_version_id')
    const recipeVersion = await getRecipeVersion(recipe.id, versionId)
    if (!recipeVersion) {
      return notFound(res)
    }
    res.type('text/plain')
    res.send(plainText(recipeVersion))
  } catch (error) {
    return internalServerError(res, error)
  }
})

export const exportRecipes = r
