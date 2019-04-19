import * as html from './html'
import * as moment from 'moment'
import { mapValues } from './importer'

const yld = ($: any) =>
  $('article.recipe section.recipe-section-information dl')
    .children()
    .filter(function() {
      return $(this)
        .text()
        .match(/yield/i)
    })
    .first()
    .next('dd')
    .text()
    .trim()

const duration = ($: any) => {
  const time = $('article.recipe section.recipe-section-information dl')
    .children()
    .filter(function() {
      return $(this)
        .text()
        .match(/time/i)
    })
    .first()
    .next('dd')
    .text()
    .trim()
  if (time) {
    return moment
      .duration(parseInt(time, 10), time.split(/\s+/)[1].charAt(0))
      .asSeconds()
  }
  return 0
}

const ingredient_lists = html.ingredient_lists(
  'article.recipe section.recipe-section > ol li'
)
const procedure_lists = html.procedure_lists(
  'article.recipe > div > section.recipe-section.recipe-section-directions > div > ol li'
)

export const Popsugar = mapValues(
  html.defaults({
    yield: yld,
    duration,
    ingredient_lists,
    procedure_lists
  })
)
