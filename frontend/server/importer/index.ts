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
import { Reddit } from './reddit'

const importers = mapValues(
  {
    'cooking.nytimes.com': NYTCooking,
    'www.blueapron.com': BlueApron,
    'dlink.blueapron.com': BlueApron,
    'www.seriouseats.com': SeriousEats,
    'www.foodnetwork.com': FoodNetwork,
    'www.popsugar.com': Popsugar
  },
  importer => fetch(toHTML(dom(importer)))
)
importers['www.reddit.com'] = fetch(toJSON(Reddit))

export const url = (u: string) => {
  const parsed = parse(u)
  const importer = importers[parsed.hostname]
  if (importer) {
    return importer
  } else {
    return fetch(toHTML(dom(GenericHTML)))
  }
}
