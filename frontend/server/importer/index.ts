import { parse } from 'url'
import { composeURL } from './importer'
import { BlueApronImporter } from './blue-apron'
import { SeriousEatsImporter } from './serious-eats'
import { NYTCookingImporter } from './nyt-cooking'
import { GenericHTMLImporter } from './generic-html-importer'

const importers = {
  'cooking.nytimes.com': composeURL(NYTCookingImporter),
  'www.blueapron.com': composeURL(BlueApronImporter),
  'www.seriouseats.com': composeURL(SeriousEatsImporter)
}

export const url = (u: string) => {
  const parsed = parse(u)
  const importer = importers[parsed.hostname]
  if (importer) {
    return importer
  } else {
    return composeURL(GenericHTMLImporter)
  }
}
