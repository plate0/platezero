import * as express from 'express'
import * as _ from 'lodash'
import { Recipe, RecipeSearchDocument, User, sequelize } from '../../models'
import { internalServerError, badRequest } from '../errors'
import { validateRecipeSearch } from '../validate'
const r = express.Router()

r.get('/', validateRecipeSearch, async function search(req, res) {
  const { q, username, sort } = req.query
  const [col, dir] = _.split(sort, '-')
  const order =
    col && dir
      ? [['recipe', col, _.toUpper(dir)]]
      : sequelize.literal(
          `ts_rank(doc, plainto_tsquery(unaccent(${sequelize.escape(q)}))) DESC`
        )
  try {
    const user = await User.findByUsername(username)
    if (!user) {
      return badRequest(res, 'user not found')
    }
    const results = await RecipeSearchDocument.findAll({
      where: {
        [sequelize.Op.and]: [
          { user_id: user.id },
          sequelize.literal(
            `doc @@ plainto_tsquery(unaccent(${sequelize.escape(q)}))`
          )
        ]
      },
      attributes: [],
      include: [{ model: Recipe }],
      order
    })
    return res.json(results)
  } catch (err) {
    return internalServerError(res, err)
  }
})

export const search = r
