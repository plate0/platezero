import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  DataType,
  Column,
  DefaultScope,
  HasMany,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import * as _ from 'lodash'
import { PostRecipe } from '../common/request-models'
import { User, UserJSON } from './user'
import { RecipeBranch, RecipeBranchJSON } from './recipe_branch'
import { RecipeVersion } from './recipe_version'
import { RecipeYield } from './recipe_yield'
import { RecipeDuration } from './recipe_duration'
import { Preheat } from './preheat'
import { RecipeVersionPreheat } from './recipe_version_preheat'
import { RecipeVersionProcedureList } from './recipe_version_procedure_list'
import { ProcedureList } from './procedure_list'
import { IngredientList } from './ingredient_list'
import { RecipeVersionIngredientList } from './recipe_version_ingredient_list'
import { config } from '../server/config'
import { toSlug } from '../common/slug'

export interface RecipeJSON {
  id?: number
  title: string
  subtitle?: string
  description?: string
  image_url?: string
  source_url?: string
  source_author?: string
  source_title?: string
  source_isbn?: string
  slug?: string
  html_url?: string
  owner: UserJSON
  branches: RecipeBranchJSON[]
}

const isUniqueSlugError = (e): boolean => {
  return Boolean(
    e.name == 'SequelizeUniqueConstraintError' &&
      e.fields['user_id'] &&
      e.fields['lower(slug::text)']
  )
}

@DefaultScope({
  include: [{ model: () => User }]
})
@Table({
  tableName: 'recipes'
})
export class Recipe extends Model<Recipe> implements RecipeJSON {
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
  public subtitle: string

  @Column
  public description: string

  @Column
  public image_url: string

  @Column public source_url: string

  @Column
  public source_author: string

  @Column
  public source_isbn: string

  @Column
  public source_title: string

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

  @Column(DataType.VIRTUAL)
  public get url(): string {
    return `${config.apiUrl}/users/${this.owner.username}/recipes/${this.slug}`
  }

  @Column(DataType.VIRTUAL)
  public get html_url(): string {
    return `${config.siteUrl}/${this.owner.username}/${this.slug}`
  }

  private static async createWithSlug(
    user_id: number,
    body: PostRecipe,
    slug: string
  ): Promise<Recipe> {
    const recipe = await Recipe.sequelize.transaction(async (transaction) => {
      const recipe = await Recipe.create(
        {
          title: body.title,
          subtitle: body.subtitle,
          description: body.description,
          slug,
          image_url: body.image_url,
          source_url: body.source_url,
          source_author: body.source_author,
          source_title: body.source_title,
          source_isbn: body.source_isbn,
          user_id
        },
        { transaction }
      )

      const recipeDuration = body.duration
        ? await RecipeDuration.create({ duration_seconds: body.duration })
        : undefined

      const recipeYield = body.yield
        ? await RecipeYield.create({ text: body.yield })
        : undefined

      const procedureLists = await Promise.all(
        _.map(body.procedure_lists, (pl) =>
          ProcedureList.createWithLines(pl, {
            transaction
          })
        )
      )

      const ingredientLists = await Promise.all(
        _.map(body.ingredient_lists, (il) =>
          IngredientList.createWithIngredients(il, { transaction })
        )
      )

      const recipeVersion = await RecipeVersion.create(
        {
          user_id,
          recipe_id: recipe.id,
          recipe_yield_id: recipeYield ? recipeYield.id : undefined,
          recipe_duration_id: recipeDuration ? recipeDuration.id : undefined,
          ingredientLists: [],
          procedureLists: [],
          message: 'Initial version'
        },
        { transaction }
      )

      const preheats = await Promise.all(
        _.map(body.preheats, (preheat) =>
          Preheat.create(preheat, { transaction })
        )
      )

      await Promise.all(
        _.map(preheats, (preheat) =>
          RecipeVersionPreheat.create(
            { recipe_version_id: recipeVersion.id, preheat_id: preheat.id },
            { transaction }
          )
        )
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
    return recipe.reload()
  }

  public static async createNewRecipe(
    user_id: number,
    body: PostRecipe
  ): Promise<Recipe> {
    // place an upper bound on retries to prevent DoS
    const sluggd = toSlug(body.title)
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
}
