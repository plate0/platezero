import { last } from 'lodash'
import * as moment from 'moment'
import { parse } from '../../common/ingredient'
import * as html from './html'
import { IngredientListJSON } from '../../models'
import { mapValues } from './importer'

const description = ($: any) =>
  $('.recipe-introduction-body p:not(.caption)')
    .first()
    .text()
    .trim()

const yld = html.text('.recipe-about .info.yield')

const duration = ($: any) => {
  // parse format: 1 hour
  const dur = $('.recipe-about li:nth-child(3) .info')
    .text()
    .replace(/about/i, '')
    .trim()
  // This parses the number part quite well, actually
  const num = parseInt(dur)
  const unit: any = last(dur.split(/\s/))
  return moment.duration(num, unit).asSeconds()
}

const preheats = html.preheats('.recipe-procedure')

const ingredient_lists = ($: any): IngredientListJSON[] => {
  const lists: IngredientListJSON[] = []
  let list: IngredientListJSON = undefined
  $('.recipe-ingredients ul li').each(function() {
    const el = $(this)
    if (el.find('strong').length > 0) {
      if (list) {
        lists.push(list)
      }
      list = {
        name: el.text(),
        lines: []
      }
    } else {
      if (!list) {
        // Default list
        list = {
          name: el.text(),
          lines: []
        }
      }
      list.lines.push(parse(el.text()))
    }
  })
  lists.push(list)
  return lists
}

const procedure_lists = html.procedure_lists(
  '.recipe-procedures ol li .recipe-procedure-text'
)

export const SeriousEats = mapValues(
  html.defaults({
    description,
    yield: yld,
    duration,
    preheats,
    ingredient_lists,
    procedure_lists
  })
)
