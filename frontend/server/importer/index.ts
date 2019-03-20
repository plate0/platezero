import { parse } from 'url'
import { BlueApronImporter } from './blue-apron'
import { SeriousEatsImporter } from './serious-eats'
import { NYTCookingImporter } from './nyt-cooking'
import { GenericHTMLImporter } from './generic-html-importer'

const importers = {
  'cooking.nytimes.com': NYTCookingImporter,
  'www.blueapron.com': BlueApronImporter,
  'www.seriouseats.com': SeriousEatsImporter
}

export const url = (u: string) => {
  const parsed = parse(u)
  const importer = importers[parsed.hostname]
  if (importer) {
    return importer
  } else {
    return GenericHTMLImporter
  }
}
