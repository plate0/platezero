import { PostRecipe } from '../../common/request-models'

export interface Importer {
  (source: any): Promise<PostRecipe>
}
