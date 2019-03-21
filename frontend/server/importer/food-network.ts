import { mapValues } from './importer'
import { first, compact } from 'lodash'
import * as moment from 'moment'
import * as html from './html'

const duration = ($: any): number | undefined => {
  // May want to reuse this in other places too. There are <script> tags which
  // hold all the recipe data in a JSON blob. Could just create a transformer
  // for such occurances.
  return first(
    compact(
      $('script')
        .map(function() {
          try {
            const time = JSON.parse($(this).get()[0].children[0].data).totalTime
            if (time) {
              return moment.duration(time).asSeconds()
            }
            return undefined
          } catch {
            return undefined
          }
        })
        .get()
    )
  )
}

const preheats = html.preheats('.o-Method ol')
const ingredient_lists = html.ingredient_lists('div.o-Ingredients__m-Body p')
const procedure_lists = html.procedure_lists('.o-Method ol li')
const yld = html.text(
  'ul.o-RecipeInfo__m-Yield li span.o-RecipeInfo__a-Description'
)

export const FoodNetwork = mapValues(
  html.defaults({
    duration,
    yield: yld,
    preheats,
    ingredient_lists,
    procedure_lists
  })
)
