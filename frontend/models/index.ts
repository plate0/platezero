import { toLower } from 'lodash'
import { Sequelize } from 'sequelize-typescript'
import { IngredientLine } from './ingredient_line'
import { IngredientListLine } from './ingredient_list_line'
import { IngredientList } from './ingredient_list'
import { Preheat } from './preheat'
import { ProcedureLine } from './procedure_line'
import { ProcedureListLine } from './procedure_list_line'
import { ProcedureList } from './procedure_list'
import { RefreshToken } from './refresh_token'
import { RecipeBranch } from './recipe_branch'
import { RecipeCollaborator } from './recipe_collaborator'
import { RecipeDuration } from './recipe_duration'
import { RecipeVersionIngredientList } from './recipe_version_ingredient_list'
import { RecipeVersionProcedureList } from './recipe_version_procedure_list'
import { RecipeVersion } from './recipe_version'
import { RecipeYield } from './recipe_yield'
import { Recipe } from './recipe'
import { RecipeVersionPreheat } from './recipe_version_preheat'
import { User } from './user'
import { config } from '../server/config'

export const sequelize = new Sequelize({
  database: config.dbName,
  dialect: 'postgres',
  username: config.dbUser,
  password: config.dbPassword,
  host: config.dbHost
})

sequelize.addModels([
  IngredientLine,
  IngredientListLine,
  IngredientList,
  Preheat,
  ProcedureLine,
  ProcedureListLine,
  ProcedureList,
  RefreshToken,
  RecipeBranch,
  RecipeCollaborator,
  RecipeDuration,
  RecipeVersionIngredientList,
  RecipeVersionProcedureList,
  RecipeVersion,
  RecipeYield,
  Recipe,
  RecipeVersionPreheat,
  User
])

export const OrderDirections = {
  asc: 'ASC',
  desc: 'DESC'
}

export const sortable = (model: any, defaultCol: string) => ([
  col,
  direction
]: any) => {
  const dir = OrderDirections[toLower(direction)]
    ? OrderDirections[toLower(direction)]
    : 'ASC'
  return model.rawAttributes[col] ? [col, dir] : [defaultCol, dir]
}

export * from './ingredient_line'
export * from './ingredient_list_line'
export * from './ingredient_list'
export * from './preheat'
export * from './procedure_line'
export * from './procedure_list_line'
export * from './procedure_list'
export * from './refresh_token'
export * from './recipe_branch'
export * from './recipe_collaborator'
export * from './recipe_duration'
export * from './recipe_version_ingredient_list'
export * from './recipe_version_procedure_list'
export * from './recipe_version'
export * from './recipe_yield'
export * from './recipe'
export * from './preheat'
export * from './user'
