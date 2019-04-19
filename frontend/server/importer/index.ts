import { parse } from 'url'
import { fetch, toHTML } from './importer'
import { dom } from './html'
import { mapValues } from 'lodash'
import { BlueApron } from './blue-apron'
import { SeriousEats } from './serious-eats'
import { NYTCooking } from './nyt-cooking'
import { GenericHTML } from './generic-html-importer'
import { FoodNetwork } from './food-network'
import { Popsugar } from './popsugar'

const importers = mapValues(
  {
    'cooking.nytimes.com': NYTCooking,
    'www.blueapron.com': BlueApron,
    'www.seriouseats.com': SeriousEats,
    'www.foodnetwork.com': FoodNetwork,
    'www.popsugar.com': Popsugar
  },
  importer => fetch(toHTML(dom(importer)))
)

export const url = (u: string) => {
  const parsed = parse(u)
  const importer = importers[parsed.hostname]
  if (importer) {
    return importer
  } else {
    return fetch(toHTML(dom(GenericHTML)))
  }
}
