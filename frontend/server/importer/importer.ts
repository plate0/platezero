import { PostRecipe } from '../../common/request-models'

export interface Importer {
  recipe(): Promise<PostRecipe>
}
