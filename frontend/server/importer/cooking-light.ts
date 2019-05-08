import * as html from './html'
import * as moment from 'moment'
import { last } from 'lodash'
import { mapValues } from './importer'

const description = ($: any) =>
  $('.recipe-summary')
    .text()
    .trim()

const duration = ($: any) => {
  const txt = $(
    '.recipe-meta-container .recipe-meta-item .recipe-meta-item-body'
  )
    .first()
    .text()
    .trim()
  const time = parseInt(txt)
  const unit = last(txt.split(/\s+/) as string[])
    .charAt(0)
    .toLowerCase()
  const dur = moment.duration(time, unit as any)
  return dur.isValid() ? dur.asSeconds() : undefined
}

const yld = ($: any) =>
  $('.recipe-meta-container .recipe-meta-item .recipe-meta-item-body')
    .last()
    .text()
    .trim()

const ingredient_lists = html.ingredient_lists('.recipe-ingredients ul li')
const procedure_lists = html.procedure_lists('.recipe-instructions .step p')

export const CookingLight = mapValues(
  html.defaults({
    description,
    duration,
    yield: yld,
    ingredient_lists,
    procedure_lists
  })
)
