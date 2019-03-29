import { readFileSync } from 'fs'
import * as jwt from 'jsonwebtoken'
import fetch from 'node-fetch'
import { SES } from 'aws-sdk'
require('aws-sdk').config.update({ region: 'us-east-1' })

const { argv } = require('yargs')
  .alias('u', 'id')
  .alias('U', 'username')
  .default('file', 'ocr/recipe.json')
  .boolean('dev')
  .demandOption(['u', 'U'])

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

const email = ({ to, name, title, url }) => {
  const params = {
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Hi ${name},

Thanks for using the PlateZero importer! We've finished importing the recipe ${title} for you. You can find it here: ${url}

If you have any questions or thoughts, please let us know by replying to this email!

Thank you`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'PlateZero Importer Success'
      }
    },
    Source: 'importer@platezero.com',
    ReplyToAddresses: ['importer@platezero.com']
  }
  return new SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise()
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
  const json = await res.json()

  await email({
    to: json.owner.email,
    name: json.owner.name || json.owner.username,
    title: json.title,
    url: json.html_url
  })
  console.log('Sent email')
}

main()
