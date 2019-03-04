import * as express from 'express'
import * as _ from 'lodash'

import { User } from '../../models/user'
import { Recipe } from '../../models/recipe'
import { validateNewUser } from '../validate'

const r = express.Router()

r.get('/', async (_, res) => {
  try {
    const users = await User.findAll()
    return res.json(users)
  } catch (error) {
    return res.json({ error })
  }
})

r.post('/', validateNewUser, async (req, res) => {
  const { username, password, email } = req.body
  const u = User.build({ username, email })
  try {
    await u.setPassword(password)
  } catch (e) {
    res.status(500)
    return res.json({ error: 'internal server error' })
  }
  try {
    await u.save()
  } catch (e) {
    res.status(400)
    return res.json({ error: 'bad request' })
  }
  return res.json(u)
})

r.get('/:username', async (req, res) => {
  const { username } = req.params
  try {
    const user = await User.findOne({ where: { username } })
    if (!user) {
      res.status(404)
      return res.json({ error: 'not found' })
    }
    return res.json(user)
  } catch (error) {
    res.status(500)
    return res.json({ error })
  }
})

r.get('/:username/recipes', async (req, res) => {
  const { username } = req.params
  try {
    const user = await User.findOne({ where: { username }, include: [Recipe] })
    return res.json(user.recipes)
  } catch (error) {
    res.status(500)
    return res.json({ error })
  }
})

r.get('/:username/recipes/:slug', async (req, res) => {
  const { username, slug } = req.params
  try {
    const recipe = await Recipe.findOne({
      where: { '$user.username$': username, slug }
    })
    if (!recipe) {
      res.status(404)
      return res.json({ error: 'not found' })
    }
    return res.json(recipe)
  } catch (error) {
    res.status(500)
    return res.json({ error })
  }
})

export const users = r
