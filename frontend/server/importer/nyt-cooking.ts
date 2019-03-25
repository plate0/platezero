import { mapValues } from './importer'
import * as moment from 'moment'
import * as html from './html'

const yld = ($: any) =>
  $('ul.recipe-time-yield li')
    .first()
    .find('span')
    .last()
    .text()
    .trim()

const duration = ($: any) =>
  moment.duration($('meta[itemprop="cookTime"]').attr('content')).asSeconds()

const preheats = html.preheats('.recipe-steps')
const ingredient_lists = html.ingredient_lists('ul.recipe-ingredients li')
const procedure_lists = html.procedure_lists('ol.recipe-steps li')

export const NYTCooking = mapValues(
  html.defaults({
    duration,
    yield: yld,
    preheats,
    ingredient_lists,
    procedure_lists
  })
)
