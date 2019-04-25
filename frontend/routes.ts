const nextroutes = require('next-routes')

export const routes: any = nextroutes()
  .add('login')
  .add('register')
  .add('user', '/:username')
  .add('user-recipe', '/:username/recipes', 'user-recipes')
  .add('import-recipe', '/recipes/new')
  .add('new-recipe', '/recipes/new/text')
  .add('import-url', '/recipes/new/url')
  .add('import-file', '/recipes/new/file')
  .add('recipe', '/:username/:slug')
  .add('recipe-version', '/:username/:slug/versions/:versionId')
  .add('edit-recipe', '/:username/:slug/branches/:branch/edit')
  .add('recipe-history', '/:username/:slug/history')

// Easy Access, usage:
// import { Link } from '../routes'
export const Link = routes.Link
export const Router = routes.Router
