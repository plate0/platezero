import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Column,
  DefaultScope,
  HasMany,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import slugify from 'slugify'
import * as _ from 'lodash'

import { User } from './user'
import { RecipeBranch } from './recipe_branch'
import { RecipeVersion } from './recipe_version'
import { RecipeYield } from './recipe_yield'
import { OvenPreheat } from './oven_preheat'
import { SousVidePreheat } from './sous_vide_preheat'
import { RecipeVersionProcedureList } from './recipe_version_procedure_list'
import { ProcedureList, ProcedureListJSON } from './procedure_list'
import { IngredientList, IngredientListJSON } from './ingredient_list'
import { RecipeVersionIngredientList } from './recipe_version_ingredient_list'
import { getConfig } from '../server/config'

const cfg = getConfig()

interface RecipeJSON {
  title: string
  image_url?: string
  source_url?: string
  yield?: string
  oven_preheat_temperature?: number
  oven_preheat_unit?: 'C' | 'F'
  sous_vide_preheat_temperature?: number
  sous_vide_preheat_unit?: 'C' | 'F'
  ingredient_lists: IngredientListJSON[]
  procedure_lists: ProcedureListJSON[]
}

const isUniqueSlugError = (e): boolean => {
  return Boolean(
    e.name == 'SequelizeUniqueConstraintError' &&
      e.fields['user_id'] &&
      e.fields['slug']
  )
}

@DefaultScope({
  include: [() => User]
})
@Table({
  tableName: 'recipes'
})
export class Recipe extends Model<Recipe> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @AllowNull(false)
  @Column
  @ForeignKey(() => User)
  public user_id: number

  @AllowNull(false)
  @Column
  public slug: string

  @AllowNull(false)
  @Column
  public title: string

  @Column
  public image_url: string

  @Column public source_url: string

  @AllowNull(false)
  @Column
  @CreatedAt
  public created_at: Date

  @Column
  @UpdatedAt
  public updated_at: Date

  @Column
  @DeletedAt
  public deleted_at: Date

  @BelongsTo(() => User)
  public owner: User

  @HasMany(() => RecipeBranch)
  public branches: RecipeBranch[]

  private static async createWithSlug(
    user_id: number,
    body: RecipeJSON,
    slug: string
  ): Promise<Recipe> {
    return Recipe.sequelize.transaction(async transaction => {
      const recipe = await Recipe.create(
        {
          title: body.title,
          slug,
          image_url: body.image_url,
          source_url: body.source_url,
          user_id
        },
        { transaction }
      )

      const recipeYield = body.yield
        ? await RecipeYield.create({ text: body.yield })
        : undefined

      const ovenPreheat = body.oven_preheat_unit
        ? await OvenPreheat.create(
            {
              temperature: body.oven_preheat_temperature,
              unit: body.oven_preheat_unit
            },
            { transaction }
          )
        : undefined

      const sousVidePreheat = body.sous_vide_preheat_unit
        ? await SousVidePreheat.create(
            {
              temperature: body.sous_vide_preheat_temperature,
              unit: body.sous_vide_preheat_unit
            },
            { transaction }
          )
        : undefined

      const procedureLists = await Promise.all(
        _.map(body.procedure_lists, pl =>
          ProcedureList.createWithSteps(pl, {
            transaction
          })
        )
      )

      const ingredientLists = await Promise.all(
        _.map(body.ingredient_lists, il =>
          IngredientList.createWithIngredients(il, { transaction })
        )
      )

      const recipeVersion = await RecipeVersion.create(
        {
          user_id,
          recipe_id: recipe.id,
          recipe_yield_id: recipeYield ? recipeYield.id : undefined,
          oven_preheat_id: ovenPreheat ? ovenPreheat.id : undefined,
          sous_vide_preheat_id: sousVidePreheat
            ? sousVidePreheat.id
            : undefined,
          ingredientLists: [],
          procedureLists: [],
          message: 'Initial version'
        },
        { transaction }
      )

      await Promise.all(
        _.map(procedureLists, (pl, sort_key) =>
          RecipeVersionProcedureList.create(
            {
              recipe_version_id: recipeVersion.id,
              procedure_list_id: pl.id,
              sort_key
            },
            { transaction }
          )
        )
      )

      await Promise.all(
        _.map(ingredientLists, (il, sort_key) =>
          RecipeVersionIngredientList.create(
            {
              recipe_version_id: recipeVersion.id,
              ingredient_list_id: il.id,
              sort_key
            },
            { transaction }
          )
        )
      )

      await RecipeBranch.create(
        {
          name: 'master',
          recipe_id: recipe.id,
          recipe_version_id: recipeVersion.id
        },
        { transaction }
      )

      return recipe
    })
  }

  public static async createNewRecipe(
    user_id: number,
    body: RecipeJSON
  ): Promise<Recipe> {
    const sluggd = slugify(body.title, { lower: true })
    // place an upper bound on retries to prevent DoS
    for (let counter = 0; counter < 100; counter++) {
      try {
        const slug = counter > 0 ? `${sluggd}-${counter}` : sluggd
        return await Recipe.createWithSlug(user_id, body, slug)
      } catch (e) {
        if (isUniqueSlugError(e)) {
          console.log('unique slug error, retrying with new slug')
        } else {
          throw e
        }
      }
    }
    throw new Error('exhausted retry possibilities, contact support')
  }

  public toJSON(): object {
    const values = Object.assign({}, this.get())
    // TODO: this needs to get fixed -- when creating a recipe, we don't have
    // the associated user populated
    if (values.owner) {
      values.url = `${cfg.apiUrl}/users/${values.owner.username}/recipes/${
        values.slug
      }`
      values.html_url = `${cfg.siteUrl}/${values.owner.username}/${values.slug}`
    }
    return values
  }
}
