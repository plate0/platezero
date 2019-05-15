const nextroutes = require('next-routes')

export const routes: any = nextroutes()
  .add('login')
  .add('register')
  .add('user', '/:username')
  .add('new-recipe', '/recipe/new')
  .add('new-recipe-text', '/recipe/new/text')
  .add('new-recipe-url', '/recipe/new/url')
  .add('new-recipe-file', '/recipe/new/file/:type')
  .add('recipe', '/:username/:slug')
  .add('recipe-version', '/:username/:slug/versions/:versionId')
  .add('edit-recipe', '/:username/:slug/branches/:branch/edit')
  .add({
    name: 'recipe-history',
    pattern: '/:username/:slug/history',
    page: 'recipe-history'
  })
  .add({
    name: 'recipe-version-history',
    pattern: '/:username/:slug/versions/:versionId/history',
    page: 'recipe-history'
  })
  .add({
    name: 'recipe-version-notes',
    pattern: '/:username/:slug/versions/:versionId/notes',
    page: 'recipe-notes'
  })
  .add({
    name: 'notes',
    pattern: '/:username/:slug/notes',
    page: 'recipe-notes'
  })

// Usage:
// import { Link } from '../routes'
export const Link = routes.Link
export const Router = routes.Router
