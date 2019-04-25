const nextroutes = require('next-routes')

export const routes: any = nextroutes()
  .add('login')
  .add('register')
  .add('user', '/:username')
  .add('user-recipe', '/:username/recipes', 'user-recipes')
  .add('new-recipe', '/recipe/new')
  .add('new-recipe-text', '/recipe/new/text')
  .add('new-recipe-url', '/recipe/new/url')
  .add('new-recipe-file', '/recipe/new/file/:type')
  .add('recipe', '/:username/:slug')
  .add('recipe-version', '/:username/:slug/versions/:versionId')
  .add('edit-recipe', '/:username/:slug/branches/:branch/edit')
  .add('recipe-history', '/:username/:slug/history')

// Usage:
// import { Link } from '../routes'
export const Link = routes.Link
export const Router = routes.Router
