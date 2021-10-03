const { first, compact } = require('lodash')
const moment = require('moment')

exports.duration = ($) => {
  // May want to reuse this in other places too. There are <script> tags which
  // hold all the recipe data in a JSON blob. Could just create a transformer
  // for such occurances.
  return first(
    compact(
      $('script')
        .map(function () {
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

exports.preheats = '.o-Method ol'
exports.ingredient_lists = 'div.o-Ingredients__m-Body p'
exports.procedure_lists = '.o-Method ol li'
exports.yield = 'ul.o-RecipeInfo__m-Yield li span.o-RecipeInfo__a-Description'
