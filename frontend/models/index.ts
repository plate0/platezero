import { Sequelize } from 'sequelize-typescript'

import { Author } from './author'
import { CookbookAuthor } from './cookbook_author'
import { CookbookRecipe } from './cookbook_recipe'
import { Cookbook } from './cookbook'
import { IngredientLine} from './ingredient_line'
import { IngredientListLine} from './ingredient_list_line'
import { IngredientList} from './ingredient_list'
import { OvenPreheat } from './oven_preheat'
import { ProcedureLine } from './procedure_line'
import { ProcedureListLine } from './procedure_list_line'
import { ProcedureList } from './procedure_list'
import { RecipeBranch } from './recipe_branch'
import { RecipeCollaborator } from './recipe_collaborator'
import { RecipeVersionIngredientList } from './recipe_version_ingredient_list'
import { RecipeVersionProcedureList } from './recipe_version_procedure_list'
import { RecipeVersion } from './recipe_version'
import { RecipeYield } from './recipe_yield'
import { Recipe } from './recipe'
import { SousVidePreheat } from './sous_vide_preheat'
import { User } from './user'

export const sequelize = new Sequelize({
  database: process.env['DATABASE_NAME'] || 'postgres',
  dialect: 'postgres',
  username: process.env['DATABASE_USER'] || 'postgres',
  password: process.env['DATABASE_PASSWORD'] || undefined
})

sequelize.addModels([
  Author,
  CookbookAuthor,
  CookbookRecipe,
  Cookbook,
  IngredientLine,
  IngredientListLine,
  IngredientList,
  OvenPreheat,
  ProcedureLine,
  ProcedureListLine,
  ProcedureList,
  RecipeBranch,
  RecipeCollaborator,
  RecipeVersionIngredientList,
  RecipeVersionProcedureList,
  RecipeVersion,
  RecipeYield,
  Recipe,
  SousVidePreheat,
  User
])
