import {
  AllowNull,
  AutoIncrement,
  Column,
  Default,
  IsIn,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

export interface IngredientLineJSON {
  id?: number
  name: string
  quantity_numerator: number
  quantity_denominator: number
  preparation: string
  optional: boolean
  unit: string
}

@Table({
  tableName: 'ingredient_lines'
})
export class IngredientLine extends Model<IngredientLine> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @AllowNull(false)
  @Column
  public name: string

  @Column public quantity_numerator: number

  @Column public quantity_denominator: number

  @Column public preparation: string

  @IsIn([
    [
      // mass
      'g',
      'mg',
      'kg',

      // weight
      'lbs',

      // volume
      'c',
      'tbsp',
      'tsp',
      'l',
      'dl',
      'ml'
    ]
  ])
  @Column
  public unit: string

  @AllowNull(false)
  @Default(false)
  @Column
  public optional: boolean
}
