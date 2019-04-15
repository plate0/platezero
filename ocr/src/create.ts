import * as jwt from 'jsonwebtoken'
import { SES } from 'aws-sdk'
import { Recipe } from './models'
require('aws-sdk').config.update({ region: 'us-east-1' })

/*
const config = {
  secret: 'test_jwt_secret',
  url: 'http://localhost:9100/api/user/recipe'
}
   */

const config = {
  secret: 'a9c26d0b386547839929e7f9c96af8fb1f7d2347f1e0405ebed9dcb88ec3f765',
  url: 'https://platezero.com/api/user/recipe'
}

/*
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
*/

export const login = (userId: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId },
      config.secret,
      { expiresIn: '1h' },
      (err: Error, token: string) => {
        if (err) {
          return reject(err)
        }
        return resolve(token)
      }
    )
  })
}

export const post = (recipe: Recipe, { token }: { token: string }) => {
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

interface EmailParams {
  to: string
  name: string
  title: string
  url: string
}

export const email = ({ to, name, title, url }: EmailParams) => {
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

export const create = async (id: number, recipe: any) => {
  const token = await login(id)
  const res = await post(recipe, { token })
  const json = await res.json()
  console.log('Created Recipe', json)

  /*
  await email({
    to: json.owner.email,
    name: json.owner.name || json.owner.username,
    title: json.title,
    url: json.html_url
  })
  */
}
