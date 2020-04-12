import { S3 } from 'aws-sdk'
import * as express from 'express'
import { size } from 'lodash'
import * as prom from 'prom-client'
import { parse as parseRecipe } from 'recipe-parser'
import { generate } from 'shortid'
import { parse } from 'url'
import { HttpStatus } from '../../common/http-status'
import { Recipe } from '../../models/recipe'
import { internalServerError } from '../errors'
import { AuthenticatedRequest } from './user'
const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = new S3()

const r = express.Router()

const urlImportCounter = new prom.Counter({
  name: 'platezero_url_imports_total',
  help: 'Total number of URLs imported',
  labelNames: ['hostname'],
})
r.post('/url', async function importUrl(req: AuthenticatedRequest, res) {
  const parsed = parse(req.body.url)
  urlImportCounter.inc({ hostname: parsed.hostname })
  try {
    const recipe = await parseRecipe(req.body.url)
    recipe.source_url = req.body.url
    // TODO: if any issues, make github issue/slack
    const status =
      size(recipe.ingredient_lists) == 0 || size(recipe.procedure_lists) == 0
        ? HttpStatus.UnprocessableEntity
        : HttpStatus.Created
    return res
      .status(status)
      .json(
        status === HttpStatus.Created
          ? await Recipe.createNewRecipe(req.user.userId, recipe)
          : recipe
      )
  } catch (err) {
    // TODO: Export recipe error
    if (err.recipe) {
      return res.status(HttpStatus.UnprocessableEntity).json(err.recipe)
    }
    return internalServerError(res, err)
  }
})

const filesPerUploadHistogram = new prom.Histogram({
  name: 'platezero_file_import_num_files',
  help: 'Number of files per upload',
  buckets: [0, 1, 2, 4, 8, 16, 32, 64],
})
const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'com-platezero-recipes',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) =>
      cb(null, `${req.user.userId}/${generate()}-${file.originalname}`),
  }),
})
r.post('/file', upload.array('file'), async function importFile(req: any, res) {
  filesPerUploadHistogram.observe(req.files.length)
  res.status(HttpStatus.Accepted).json({ upload: 'success' })
})

export const importers = r
