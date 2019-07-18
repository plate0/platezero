import * as express from 'express'
import { Request } from 'express'
import * as _ from 'lodash'
import { generate as shortid } from 'shortid'
import { S3 } from 'aws-sdk'
const multer = require('multer')
const multerS3 = require('multer-s3')
import { importers } from './importer'
import {
  validateNewRecipe,
  validateRecipePatch,
  validateRecipeVersionPatch,
  validateUserPatch,
  validateNewNote,
  validateNotePatch,
  validateNewFavorite
} from '../validate'
import {
  User,
  Recipe,
  RecipeBranch,
  RecipeVersion,
  Note,
  Favorite
} from '../../models'
import { notFound, internalServerError, badRequest } from '../errors'
import { HttpStatus } from '../../common/http-status'

const s3 = new S3()

interface UserDetail {
  userId: number
  username: string
}

export interface AuthenticatedRequest extends Request {
  user: UserDetail
}

const r = express.Router()

r.get('/', async function getCurrentUser(req: AuthenticatedRequest, res) {
  try {
    const user = await User.findOne({ where: { username: req.user.username } })
    return res.json(user)
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.put('/', validateUserPatch, async function updateUser(
  req: AuthenticatedRequest,
  res
) {
  try {
    const user = await User.findByUsername(req.user.username)
    await user.update(req.body)
    return res.json(user)
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.post('/recipe', validateNewRecipe, async function createRecipe(
  req: AuthenticatedRequest,
  res
) {
  try {
    return res
      .status(HttpStatus.Created)
      .json(await Recipe.createNewRecipe(req.user.userId, req.body))
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.patch('/recipes/:slug', validateRecipePatch, async function updateRecipe(
  req: AuthenticatedRequest,
  res
) {
  try {
    const { slug } = req.params
    const recipe = await Recipe.findOne({
      where: { user_id: req.user.userId, slug }
    })
    if (!recipe) {
      return notFound(res)
    }
    await recipe.update(req.body)
    return res.json(recipe)
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.post('/notes', validateNewNote, async function createNote(
  req: AuthenticatedRequest,
  res
) {
  try {
    const { recipe_id, recipe_version_id } = req.body
    const version = await RecipeVersion.findOne({
      where: { id: recipe_version_id, user_id: req.user.userId, recipe_id }
    })
    if (!version) {
      return badRequest(res)
    }
    const note = await Note.create({
      recipe_id,
      recipe_version_id,
      text: req.body.text,
      pinned: req.body.pinned,
      author_id: req.user.userId
    })
    return res.json(await note.reload({ include: [{ model: User }] }))
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.patch('/notes/:id', validateNotePatch, async function updateNote(
  req: AuthenticatedRequest,
  res
) {
  try {
    const note = await Note.findOne({
      where: { id: req.params.id, author_id: req.user.userId }
    })
    if (!note) {
      return notFound(res)
    }
    return res.json(
      await note.update(req.body, {
        include: [{ model: User }]
      })
    )
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.delete('/notes/:id', async function deleteNote(
  req: AuthenticatedRequest,
  res
) {
  try {
    const note = await Note.findOne({
      where: { id: req.params.id, author_id: req.user.userId }
    })
    if (!note) {
      return notFound(res)
    }
    await note.destroy()
    return res.status(HttpStatus.NoContent).end()
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.patch(
  '/recipes/:slug/branches/:branch',
  validateRecipeVersionPatch,
  async function updateRecipeVersion(req: AuthenticatedRequest, res) {
    try {
      const { slug, branch } = req.params
      const recipe = await Recipe.findOne({
        where: { user_id: req.user.userId, slug }
      })
      if (!recipe) {
        return notFound(res)
      }
      const currentBranch = await RecipeBranch.findOne({
        where: { recipe_id: recipe.id, name: branch }
      })
      if (!currentBranch) {
        return notFound(res)
      }
      res
        .status(HttpStatus.Ok)
        .json(await currentBranch.applyPatch(req.body, req.user.userId))
    } catch (err) {
      return internalServerError(res, err)
    }
  }
)

r.delete('/recipes/:slug', async function deleteRecipe(
  req: AuthenticatedRequest,
  res
) {
  try {
    const { slug } = req.params
    const recipe = await Recipe.findOne({
      where: { user_id: req.user.userId, slug }
    })
    if (!recipe) {
      return notFound(res)
    }
    await recipe.destroy()
    res.status(HttpStatus.NoContent).json()
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.use('/import', importers)

const IMAGE_EXTENSIONS_BY_TYPE = new Map([
  ['image/gif', 'gif'],
  ['image/jpeg', 'jpg'],
  ['image/pjpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/tiff', 'tiff'],
  ['image/x-tiff', 'tiff']
])
const upload = multer({
  fileFilter: (__, file, cb) => {
    const acceptable = IMAGE_EXTENSIONS_BY_TYPE.has(file.mimetype)
    return cb(null, acceptable)
  },
  storage: multerS3({
    s3,
    bucket: 'com-platezero-static',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      const key = `u/${shortid()}.${IMAGE_EXTENSIONS_BY_TYPE.get(
        file.mimetype
      )}`
      req.pzUploadKey = key
      return cb(null, key)
    }
  })
})

r.post('/images', upload.single('file'), async function uploadPublicImage(
  req: any,
  res
) {
  res.status(HttpStatus.Created).json({
    url: `https://static.platezero.com/${req.pzUploadKey}`
  })
})

r.post('/favorites', validateNewFavorite, async function addFavorite(
  req: AuthenticatedRequest,
  res
) {
  try {
    return res.json(
      await Favorite.create({
        user_id: req.user.userId,
        recipe_id: req.body.recipe_id
      })
    )
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.delete('/favorites/:recipeId', async function removeFavorite(
  req: AuthenticatedRequest,
  res
) {
  try {
    const recipe_id = parseInt(req.params.recipeId, 10)
    const user_id = req.user.userId
    const fav = await Favorite.findOne({ where: { recipe_id, user_id } })
    if (!fav) {
      return notFound(res)
    }
    await fav.destroy()
    res.status(HttpStatus.NoContent).json()
  } catch (err) {
    return internalServerError(res, err)
  }
})

export const user = r
