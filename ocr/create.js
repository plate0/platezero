const { readFileSync } = require('fs')
const jwt = require('jsonwebtoken')
const { SES } = require('aws-sdk')
require('aws-sdk').config.update({ region: 'us-east-1' })
const fetch = require('node-fetch')

const { argv } = require('yargs').demandOption(['id'])

const config = {
  secret: 'a9c26d0b386547839929e7f9c96af8fb1f7d2347f1e0405ebed9dcb88ec3f765',
  url: 'https://platezero.com/api/user/recipe'
}

const login = userId => {
  return new Promise((resolve, reject) => {
    jwt.sign({ userId }, config.secret, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        return reject(err)
      }
      return resolve(token)
    })
  })
}

const post = (recipe, { token }) => {
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
  const { id } = argv
  const token = await login(id)
  const recipe = readFileSync('recipe.json')
  const res = await create(recipe, { token })
  const json = await res.json()
  console.log(json)
}

main()
