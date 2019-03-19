import { parse } from 'url'
import { BlueApronImporter } from './blue-apron'
import { SeriousEatsImporter } from './serious-eats'

const importers = {
  'www.blueapron.com': BlueApronImporter,
  'www.seriouseats.com': SeriousEatsImporter
}

export const url = (u: string) => {
  const parsed = parse(u)
  const importer = importers[parsed.hostname]
  if (importer) {
    return importer
  } else {
    throw new Error(`unsupported site: '${parsed.hostname}'`)
  }
}
