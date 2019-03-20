import { PostRecipe } from '../../common/request-models'
import fetch from 'node-fetch'

export interface Importer {
  (source: any): Promise<PostRecipe>
}

/**
 * Composes a given function to accept a URL and passes through the
 * HTML from that URL.
 */
export const composeURL = (f: Importer): Importer => {
  return async (url: string): Promise<PostRecipe> => {
    return f(
      await fetch(url).then(res => {
        if (res.status >= 400) {
          throw new Error('error fetching')
        }
        return res.text()
      })
    )
  }
}
