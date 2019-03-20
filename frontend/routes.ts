const nextroutes = require('next-routes')

export const routes: any = nextroutes()
  .add('login')
  .add('register')
  .add('user', '/:username')
  .add('user-recipe', '/:username/recipes', 'user-recipes')
  .add('new-recipe', '/recipes/new')
  .add('import-recipe', '/recipes/import')
  .add('recipe', '/:username/:slug')
  .add('recipe-version', '/:username/:slug/versions/:versionId')
  .add('edit-recipe', '/:username/:slug/branches/:branch/edit')

// Easy Access, usage:
// import { Link } from '../routes'
export const Link = routes.Link
