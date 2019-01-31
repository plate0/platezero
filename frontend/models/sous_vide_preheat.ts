import {
  AllowNull,
  AutoIncrement,
  Column,
  IsIn,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'

@Table({
  tableName: 'sous_vide_preheats'
})
export class SousVidePreheat extends Model<SousVidePreheat> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number

  @AllowNull(false)
  @Column
  public temperature: number

  @AllowNull(false)
  @IsIn([['C', 'F']])
  @Column
  public unit: string
}
