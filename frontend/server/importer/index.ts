import { parse } from 'url'
import { fetch, toHTML, toJSON } from './importer'
import { dom } from './html'
import { mapValues } from 'lodash'
import { BlueApron } from './blue-apron'
import { SeriousEats } from './serious-eats'
import { NYTCooking } from './nyt-cooking'
import { GenericHTML } from './generic-html-importer'
import { FoodNetwork } from './food-network'
import { Popsugar } from './popsugar'
import { CookingLight } from './cooking-light'
import { DeliciousMagazine } from './deliciousmagazine'
import { Reddit } from './reddit'
import { IVU } from './ivu'

const importers = mapValues(
  {
    'cooking.nytimes.com': NYTCooking,
    'www.blueapron.com': BlueApron,
    'dlink.blueapron.com': BlueApron,
    'www.seriouseats.com': SeriousEats,
    'www.foodnetwork.com': FoodNetwork,
    'www.cookinglight.com': CookingLight,
    'www.popsugar.com': Popsugar,
    'www.deliciousmagazine.co.uk': DeliciousMagazine,
    "ivu.org": IVU,
  },
  importer => fetch(toHTML(dom(importer)))
)
importers['www.reddit.com'] = async (url: string) => {
  const recipe = await fetch(toJSON(Reddit))(`${url}.json`)
  return recipe ? recipe : fetch(toHTML(dom(GenericHTML)))(url)
}

export const url = (u: string) => {
  const parsed = parse(u)
  const importer = importers[parsed.hostname]
  if (importer) {
    return importer
  } else {
    return fetch(toHTML(dom(GenericHTML)))
  }
}
