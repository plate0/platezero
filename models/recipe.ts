import { PostRecipe } from '../common/request-models'
import { toSlug } from '../common/slug'
import { RecipeBranch, RecipeBranchJSON } from './recipe_branch'
import { User, UserJSON } from './user'

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

export class Recipe implements RecipeJSON {
  public declare id: number

  public user_id: number

  public slug: string

  public title: string

  public subtitle: string

  public description: string

  public image_url: string

  public source_url: string

  public source_author: string

  public source_isbn: string

  public source_title: string

  public created_at: Date

  public updated_at: Date

  public deleted_at: Date

  public owner: User

  public branches: RecipeBranch[]

  public get url(): string {
    return `${process.env.API_URL}/users/${this.owner.username}/recipes/${this.slug}`
  }

  public get html_url(): string {
    return `${process.env.SITE_URL}/${this.owner.username}/${this.slug}`
  }

  private static async createWithSlug(
    _user_id: number,
    _body: PostRecipe,
    _slug: string
  ): Promise<Recipe> {
    return null
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
