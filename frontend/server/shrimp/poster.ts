import { Recipe } from '../../models'
import { PostRecipe } from '../../common/request-models'

export async function post(recipe: PostRecipe, user: number): Promise<Recipe> {
  return Recipe.createNewRecipe(user, recipe)
}
