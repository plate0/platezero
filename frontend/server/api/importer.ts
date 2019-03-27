import * as express from 'express'
import * as Importers from '../importer'
import { AuthenticatedRequest } from './user'
import { Recipe } from '../../models/recipe'
import { internalServerError } from '../errors'
import { S3 } from 'aws-sdk'
import fetch from 'node-fetch'
import { HttpStatus } from '../../common/http-status'
import { getConfig } from '../config'
const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = new S3()
const { slackHook } = getConfig()

const r = express.Router()

r.post('/url', async (req: AuthenticatedRequest, res) => {
  try {
    const importer = Importers.url(req.body.url)
    const recipe = await importer(req.body.url)
    recipe.source_url = req.body.url
    return res
      .status(HttpStatus.Created)
      .json(await Recipe.createNewRecipe(req.user.userId, recipe))
  } catch (err) {
    return internalServerError(res, err)
  }
})

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'com-platezero-recipes',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => cb(null, `${req.user.userId}/${file.originalname}`)
  })
})

r.post('/file', upload.array('file'), async (req: any, res) => {
  if (slackHook) {
    fetch(slackHook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: `${req.user.username} (id: ${req.user.userId}) uploaded ${
          req.files.length
        } recipes. 
Find them here: https://s3.console.aws.amazon.com/s3/buckets/com-platezero-recipes/?region=us-east-1
${req.files.map(f => f.originalname).join('\n')}`
      })
    })
  }
  res.status(HttpStatus.Accepted).json({
    upload: 'success'
  })
})

export const importers = r
