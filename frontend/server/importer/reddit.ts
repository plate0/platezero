import { RedditRecipes } from './reddit-recipes'
import { first, get } from 'lodash'

const importers = {
  recipes: RedditRecipes
}

export const Reddit = (json: any) => {
  const subreddit = get(first(json), 'data.children[0].data.subreddit')
  return importers[subreddit] ? importers[subreddit](json) : undefined
}
