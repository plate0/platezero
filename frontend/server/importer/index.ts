import { parse } from 'url'
import { fetch, toHTML } from './importer'
import { dom } from './html'
import { mapValues } from 'lodash'
// import { BlueApronImporter } from './blue-apron'
import { SeriousEats } from './serious-eats'
import { NYTCooking } from './nyt-cooking'
// import { GenericHTMLImporter } from './generic-html-importer'
import { FoodNetwork } from './food-network'

const importers = mapValues(
  {
    'cooking.nytimes.com': NYTCooking,
    //  'www.blueapron.com': composeURL(BlueApronImporter),
    'www.seriouseats.com': SeriousEats,
    'www.foodnetwork.com': FoodNetwork
  },
  importer => fetch(toHTML(dom(importer)))
)

export const url = (u: string) => {
  const parsed = parse(u)
  const importer = importers[parsed.hostname]
  if (importer) {
    return importer
  } else {
    return //composeURL(GenericHTMLImporter)
  }
}
