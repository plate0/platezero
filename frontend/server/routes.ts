const nextroutes = require('next-routes')

export const routes: any = nextroutes()
  .add('login')
  .add('register')
  .add('user', '/:username')
