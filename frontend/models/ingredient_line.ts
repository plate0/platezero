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
export class IngredientLine extends Model<IngredientLine>
  implements IngredientLineJSON {
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
      'oz',

      // weight
      'lb',

      // volume
      'c',
      'qt',
      'tbsp',
      'tsp',
      'l',
      'dl',
      'ml',

      // distance
      'in',
      'ft',
      'cm',
      'm'
    ]
  ])
  @Column
  public unit: string

  @AllowNull(false)
  @Default(false)
  @Column
  public optional: boolean
}
