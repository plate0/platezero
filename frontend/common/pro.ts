import { ProfileQuestionJSON } from '../models'
import { first } from 'lodash'

const Family = (section: ProfileQuestionJSON[]) => {
  const members = (first(section.filter(q => q.type === 'Family')).answer || '')
    .split(',')
    .map((s, i) => `${s} ${['Adults', 'Children'][i]}`)
  return members
}

export const preview = (section: ProfileQuestionJSON[]) => {}
