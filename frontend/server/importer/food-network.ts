import { Importer } from './importer'
import { first, compact } from 'lodash'
import * as moment from 'moment'
import * as cheerio from 'cheerio'
import { PostRecipe } from '../../common/request-models'
import {
  description,
  ingredients,
  image_url,
  title,
  text,
  preheats,
  procedure_lists
} from './html'

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

export const FoodNetworkImporter: Importer = async (
  source: any
): Promise<PostRecipe> => {
  const $ = cheerio.load(source)
  const yld = text(
    $,
    'ul.o-RecipeInfo__m-Yield li span.o-RecipeInfo__a-Description'
  )
  return {
    title: title($),
    description: description($),
    image_url: image_url($),
    source_url: source,
    yield: yld,
    duration: duration($),
    preheats: preheats($, '.o-Method ol'),
    ingredient_lists: ingredients($, 'div.o-Ingredients__m-Body p'),
    procedure_lists: procedure_lists($, '.o-Method ol li')
  }
}
