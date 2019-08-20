import * as express from 'express'
import { AuthenticatedRequest } from './user'
import { internalServerError } from '../errors'
import { Family, ProfileQuestion, User, UserProfile } from '../../models'
import { validateAnswer } from '../validate'

const r = express.Router()

r.get('/profile', async (req: AuthenticatedRequest, res) => {
  try {
    return res.json(await UserProfile.findFor({ user_id: req.user.userId }))
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.get('/family', async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findByPk(req.user.userId)
    let { family_id } = user
    // First time requesting family, lazy load
    if (!family_id) {
      ;({ id: family_id } = await Family.create())
      await user.update({ family_id })
    }
    const family = await Family.findByPk(family_id, {
      include: [
        {
          model: User
        }
      ]
    })
    family.users = (await Promise.all(
      family.users.map(async u => ({
        ...u,
        profile: await UserProfile.findFor({ user_id: u.id })
      }))
    )) as any
    family.profile = await UserProfile.findFor({ family_id: family.id })
    console.log(family)
    return res.json(family)
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.get('/question/:id', async (req: AuthenticatedRequest, res) => {
  try {
    return res.json(await ProfileQuestion.findByPk(req.params.id))
  } catch (err) {
    return internalServerError(res, err)
  }
})

r.put('/answer', validateAnswer, async (req: AuthenticatedRequest, res) => {
  const { id, family_id, user_id, question_id, answer } = req.body
  try {
    const [found, created] = await UserProfile.findOrCreate({
      where: { id },
      defaults: { family_id, user_id, question_id, answer }
    })
    if (!created) {
      await found.update({ answer })
    }
    return res.json(found)
  } catch (err) {
    return internalServerError(res, err)
  }
})

export const pro = r
