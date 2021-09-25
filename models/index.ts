import { toLower } from 'lodash'

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

export * from './favorite'
export * from './ingredient_line'
export * from './ingredient_list'
export * from './ingredient_list_line'
export * from './note'
export * from './preheat'
export * from './procedure_line'
export * from './procedure_list'
export * from './procedure_list_line'
export * from './recipe'
export * from './recipe_branch'
export * from './recipe_collaborator'
export * from './recipe_duration'
export * from './recipe_search_document'
export * from './recipe_version'
export * from './recipe_version_ingredient_list'
export * from './recipe_version_procedure_list'
export * from './recipe_yield'
export * from './refresh_token'
export * from './user'
export * from './user_activity'
