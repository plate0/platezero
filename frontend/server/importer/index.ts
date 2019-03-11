import { parse } from 'url'
import { BlueApronImporter } from './blue-apron'

const _importers = {
  'www.blueapron.com': BlueApronImporter
}

export const url = (u: string) => {
  const parsed = parse(u)
  try {
    return new _importers[parsed.hostname](u)
  } catch (err) {
    throw new Error(`unsupported site: '${parsed.hostname}'`)
  }
}
