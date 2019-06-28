import { Recipe } from '../../models'
import { PostRecipe } from '../../common/request-models'

export async function post(recipe: PostRecipe, user: number): Promise<Recipe> {
  const out = await Recipe.createNewRecipe(user, recipe)
  return Promise.resolve(out)
}
