import * as express from 'express'
import { User } from '../models/user'
import { Recipe } from '../models/recipe'

const r = express.Router()

r.get('/', (_, res) => {
  res.json({api: true})
})

r.get('/users', async (_, res) => {
  try {
    const users = await User.findAll()
    return res.json(users)
  } catch (error) {
    return res.json({ error })
  }
})

r.get('/user/:username', async (req, res) => {
  const { username } = req.params
  try {
    const user = await User.findOne({ where: { username }})
    return res.json(user)
  } catch (error) {
    return res.json({ error })
  }
})

r.get('/user/:username/recipes', async (req, res) => {
  const { username } = req.params
  try {
    const user = await User.findOne({ where: { username }, include: [ Recipe ]})
    return res.json(user.recipes)
  } catch (error) {
    return res.json({ error })
  }
})

r.get('/user/:username/recipe/:slug', async (req, res) => {
  const { username, slug } = req.params
  try {
    const recipe = await Recipe.findOne({ include: [ User ], where: { '$user.username$': username, slug }})
    return res.json(recipe)
  } catch (error) {
    return res.json({ error })
  }
})

export const api = r
