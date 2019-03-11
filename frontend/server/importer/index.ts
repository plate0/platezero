import { parse } from 'url'
import { BlueApronImporter } from './blue-apron'

const _importers = {
  'blueapron.com': BlueApronImporter
}

export const url = (u: string) => {
  const parsed = parse(u)
  try {
    return new _importers[parsed.hostname]()
  } catch (err) {
    throw new Error(`unsupported site: '${parsed.hostname}'`)
  }
}
