import { readFileSync } from 'fs'
import * as jwt from 'jsonwebtoken'
import fetch from 'node-fetch'

const { argv } = require('yargs')
  .alias('u', 'id')
  .alias('U', 'username')
  .default('file', 'recipe.json')
  .boolean('dev')
  .demandOption(['u, U'])

const config = argv.dev
  ? {
      secret: 'test_jwt_secret',
      url: 'http://localhost:9100/api/user/recipe'
    }
  : {
      secret:
        'a9c26d0b386547839929e7f9c96af8fb1f7d2347f1e0405ebed9dcb88ec3f765',
      url: 'https://platezero.com/api/user/recipe'
    }

const login = (userId: number, username: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId, username },
      config.secret,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          return reject(err)
        }
        return resolve(token)
      }
    )
  })
}

const read = (file: string) => {
  return JSON.parse(readFileSync(file, { encoding: 'utf8' }))
}

const create = (recipe, { token }) => {
  return fetch(config.url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(recipe)
  })
}

const main = async () => {
  const { id, username, file } = argv
  console.log('id', id)
  console.log('username', username)
  console.log('file', file)

  const token = await login(id, username)
  console.log(token)

  const recipe = read(file)
  console.log(recipe)

  const res = await create(recipe, { token })
  console.log(await res.text())
}

main()
