import * as express from 'express'
import { first, find, toInteger, size } from 'lodash'
import { Request } from 'express'
import { User, ShoppingList, ShoppingListItem } from '../../models'
import { internalServerError, notFound } from '../errors'
import { HttpStatus } from '../../common/http-status'
import {
  validateShoppingListPostPatch,
  validateShoppingListItemPost,
  validateShoppingListItemPatch
} from '../validate'

interface ShoppingRequest extends Request {
  user: User
}

const r = express.Router()

r.use('/', async (req, res, next) => {
  const {
    user: { userId: id }
  } = req as any
  try {
    const user = await User.findOne({
      where: { id },
      include: [{ model: ShoppingList }]
    })
    ;(req as ShoppingRequest).user = user
    next()
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.get('/lists', async (req: ShoppingRequest, res) => {
  try {
    return res.json(req.user.shoppingLists)
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.post(
  '/list',
  validateShoppingListPostPatch,
  async (req: ShoppingRequest, res) => {
    try {
      const list = await req.user.$create('shoppingList', req.body)
      res.json(list)
    } catch (err) {
      return internalServerError(res, err)
    }
  }
)

r.get('/list/:id', async (req: ShoppingRequest, res) => {
  const { id } = req.params
  try {
    return res.json(
      await ShoppingList.findOne({
        where: {
          user_id: req.user.id,
          id
        },
        include: [{ model: ShoppingListItem }],
        order: [['items', 'completed', 'ASC'], ['items', 'created_at', 'ASC']]
      })
    )
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.patch(
  '/list/:id',
  validateShoppingListPostPatch,
  async (req: ShoppingRequest, res) => {
    try {
      const id = toInteger(req.params.id)
      const list = find(req.user.shoppingLists, { id })
      if (!list) {
        return notFound(res)
      }
      await list.update(req.body)
      res.json(list)
    } catch (err) {
      return internalServerError(res, err)
    }
  }
)

r.delete('/list/:id', async (req: ShoppingRequest, res) => {
  try {
    const id = toInteger(req.params.id)
    const list = find(req.user.shoppingLists, { id })
    if (!list) {
      return notFound(res)
    }
    await list.destroy()
    return res.status(HttpStatus.NoContent).end()
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.post(
  '/list/:id/item',
  validateShoppingListItemPost,
  async (req: ShoppingRequest, res) => {
    try {
      const { user } = req
      const id = toInteger(req.params.id)
      const list = find(user.shoppingLists, { id }) as ShoppingList
      if (!list) {
        return notFound(res)
      }
      const item = await list.$create('item', req.body)
      res.json(item)
    } catch (err) {
      return internalServerError(res, err)
    }
  }
)

r.patch(
  '/list/:id/item/:item_id',
  validateShoppingListItemPatch,
  async (req: ShoppingRequest, res) => {
    try {
      const { user } = req
      const { item_id } = req.params
      const id = toInteger(req.params.id)
      const list = find(user.shoppingLists, { id }) as ShoppingList
      if (!list) {
        return notFound(res)
      }
      const items = (await list.$get('items', {
        where: { id: item_id },
        limit: 1
      })) as ShoppingListItem[]
      if (!size(items)) {
        return notFound(res)
      }
      const item = first(items)
      await item.update(req.body)
      res.json(item)
    } catch (err) {
      return internalServerError(res, err)
    }
  }
)

r.delete('/list/:id/item/:item_id', async (req: ShoppingRequest, res) => {
  try {
    const { user } = req
    const { item_id } = req.params
    const id = toInteger(req.params.id)
    const list = find(user.shoppingLists, { id }) as ShoppingList
    const items = (await list.$get('items', {
      where: { id: item_id },
      limit: 1
    })) as ShoppingListItem[]
    if (!size(items)) {
      return notFound(res)
    }
    const item = first(items)
    await item.destroy()
    return res.status(HttpStatus.NoContent).end()
  } catch (err) {
    return internalServerError(res, err)
  }
})

export const shopping = r
