import {
  Table,
  AllowNull,
  Column,
  DataType,
  IsIn,
  Default,
  ForeignKey,
  Model,
  Unique,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  HasMany,
  BelongsToMany
} from 'sequelize-typescript'

@Table({
  tableName: 'authors'
})
export class Author extends Model<Author> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number

  @Column
  @AllowNull(false)
  public name: string

  @BelongsToMany(() => Cookbook, () => CookbookAuthor)
  cookbooks: Cookbook[]
}

@Table({
  tableName: 'cookbook_authors'
})
export class CookbookAuthor extends Model<CookbookAuthor> {
  @Column
  @ForeignKey(() => Author)
  public author_id: number

  @Column
  @ForeignKey(() => Cookbook)
  public cookbook_id: number
}

@Table({
  tableName: 'cookbook_recipes'
})
export class CookbookRecipe extends Model<CookbookRecipe> {
  @Column
  @AutoIncrement
  @PrimaryKey
  public id: number

  @Column
  @ForeignKey(() => Cookbook)
  @AllowNull(false)
  public cookbook_id: number

  @Column
  @AllowNull(false)
  public page: string

  @Column
  @AllowNull(false)
  public title: string

  @BelongsTo(() => Cookbook)
  public cookbook: Cookbook
}

@Table({
  tableName: 'cookbooks'
})
export class Cookbook extends Model<Cookbook> {
  @Column
  @AutoIncrement
  @PrimaryKey
  public id: number

  @Column
  @AllowNull(false)
  public title: string

  @Column
  @AllowNull(false)
  @Unique
  public isbn: string

  @HasMany(() => CookbookRecipe)
  public recipes: CookbookRecipe[]

  @BelongsToMany(() => Author, () => CookbookAuthor)
  public authors: Author[]
}

@Table({
  tableName: 'ingredient_lines'
})
export class IngredientLine extends Model<IngredientLine> {
  @Column
  @AutoIncrement
  @PrimaryKey
  public id: number

  @Column
  @AllowNull(false)
  public name: string

  @Column public quantity_numerator: number

  @Column public quantity_denominator: number

  @Column public preparation: string

  @Column
  @AllowNull(false)
  @Default(false)
  public optional: boolean
}

@Table({
  tableName: 'ingredient_list_lines'
})
export class IngredientListLine extends Model<IngredientListLine> {
  @Column
  @ForeignKey(() => IngredientList)
  @AllowNull(false)
  public ingredient_list_id: number

  @Column
  @ForeignKey(() => IngredientLine)
  @AllowNull(false)
  public ingredient_line_id: number

  @Column public sort_key: number
}

@Table({
  tableName: 'ingredient_lists'
})
export class IngredientList extends Model<IngredientList> {
  @Column
  @AutoIncrement
  @PrimaryKey
  public id: number

  @Column public name: string
}

@Table({
  tableName: 'oven_preheats'
})
export class OvenPreheat extends Model<OvenPreheat> {
  @Column
  @AutoIncrement
  @PrimaryKey
  public id: number

  @Column
  @AllowNull(false)
  public temperature: number

  @Column
  @AllowNull(false)
  @IsIn(['C', 'F'])
  public unit: string
}

@Table({
  tableName: 'procedure_lines'
})
export class ProcedureLine extends Model<ProcedureLine> {
  @Column
  @AutoIncrement
  @PrimaryKey
  public id: number

  @Column
  @AllowNull(false)
  public text: string
}

@Table({
  tableName: 'procedure_list_lines'
})
export class ProcedureListLine extends Model<ProcedureListLine> {
  @Column
  @AllowNull(false)
  @ForeignKey(() => ProcedureList)
  public procedure_list_id: number

  @Column
  @AllowNull(false)
  @ForeignKey(() => ProcedureLine)
  public procedure_line_id: number

  @Column public sort_key: number

  @BelongsTo(() => ProcedureList)
  public procedureList: ProcedureList

  @BelongsTo(() => ProcedureLine)
  public procedureLine: ProcedureLine
}

@Table({
  tableName: 'procedure_lists'
})
export class ProcedureList extends Model<ProcedureList> {
  @Column
  @AutoIncrement
  @PrimaryKey
  public id: number

  @Column public name: string
}

@Table({
  tableName: 'recipe_branches'
})
export class RecipeBranch extends Model<RecipeBranch> {
  @Column
  @AllowNull(false)
  @ForeignKey(() => Recipe)
  public recipe_id: number

  @Column
  @AllowNull(false)
  public name: string

  @Column
  @AllowNull(false)
  @ForeignKey(() => RecipeVersion)
  public recipe_version_id: number

  @BelongsTo(() => Recipe)
  public recipe: Recipe

  @BelongsTo(() => RecipeVersion)
  public recipeVersion: RecipeVersion
}

@Table({
  tableName: 'recipe_collaborators'
})
export class RecipeCollaborator extends Model<RecipeCollaborator> {
  @Column
  @AutoIncrement
  @PrimaryKey
  public id: number

  @Column
  @AllowNull(false)
  @ForeignKey(() => Recipe)
  public recipe_id: number

  @Column
  @AllowNull(false)
  @ForeignKey(() => User)
  public user_id: number

  @Column
  @AllowNull(false)
  @Default(false)
  public accepted: boolean

  @BelongsTo(() => Recipe)
  public recipe: Recipe

  @BelongsTo(() => User)
  public user: User
}

@Table({
  tableName: 'recipe_titles'
})
export class RecipeTitle extends Model<RecipeTitle> {
  @Column
  @AutoIncrement
  @PrimaryKey
  public id: number

  @Column
  @AllowNull(false)
  public text: string
}

@Table({
  tableName: 'recipe_version_ingredient_lists'
})
export class RecipeVersionIngredientList extends Model<
  RecipeVersionIngredientList
> {
  @Column
  @AllowNull(false)
  @ForeignKey(() => RecipeVersion)
  public recipe_version_id: number

  @Column
  @AllowNull(false)
  @ForeignKey(() => IngredientList)
  public ingredient_list_id: number

  @Column public sort_key: number

  @BelongsTo(() => RecipeVersion)
  public recipeVersion: RecipeVersion

  @BelongsTo(() => IngredientList)
  public ingredientList: IngredientList
}

@Table({
  tableName: 'recipe_version_procedure_lists'
})
export class RecipeVersionProcedureList extends Model<
  RecipeVersionProcedureList
> {
  @Column
  @AllowNull(false)
  @ForeignKey(() => RecipeVersion)
  public recipe_version_id: number

  @Column
  @AllowNull(false)
  @ForeignKey(() => ProcedureList)
  public procedure_list_id: number

  @Column public sort_key: number

  @BelongsTo(() => RecipeVersion)
  public recipeVersion: RecipeVersion

  @BelongsTo(() => ProcedureList)
  public procedureList: ProcedureList
}

@Table({
  tableName: 'recipe_versions'
})
export class RecipeVersion extends Model<RecipeVersion> {
  @Column
  @AutoIncrement
  @PrimaryKey
  public id: number

  @Column
  @ForeignKey(() => Recipe)
  @AllowNull(false)
  public recipe_id: number

  @Column
  @AllowNull(false)
  public created_at: Date

  @Column
  @ForeignKey(() => User)
  @AllowNull(false)
  public user_id: number

  @Column
  @ForeignKey(() => RecipeVersion)
  public parent_recipe_version_id: number

  @Column
  @ForeignKey(() => RecipeTitle)
  @AllowNull(false)
  public recipe_title_id: number

  @Column
  @ForeignKey(() => RecipeYield)
  public recipe_yield_id: number

  @Column
  @ForeignKey(() => OvenPreheat)
  public oven_preheat_id: number

  @Column
  @ForeignKey(() => SousVidePreheat)
  public sous_vide_preheat_id: number

  @Column
  @AllowNull(false)
  public message: string

  @BelongsTo(() => Recipe)
  public recipe: Recipe

  @BelongsTo(() => User)
  public user: User

  @BelongsTo(() => RecipeVersion)
  public parentRecipeVersion: RecipeVersion

  @BelongsTo(() => RecipeTitle)
  public recipeTitle: RecipeTitle

  @BelongsTo(() => RecipeYield)
  public recipeYield: RecipeYield

  @BelongsTo(() => OvenPreheat)
  public ovenPreheat: OvenPreheat

  @BelongsTo(() => SousVidePreheat)
  public sousVidePreheat: SousVidePreheat
}

@Table({
  tableName: 'recipe_yields'
})
export class RecipeYield extends Model<RecipeYield> {
  @Column
  @AutoIncrement
  @PrimaryKey
  public id: number
}
