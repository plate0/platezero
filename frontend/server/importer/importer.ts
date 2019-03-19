import { PostRecipe } from '../../common/request-models'
import fetch from 'node-fetch'

export const fetchHTML = async (url: string): Promise<string> =>
  fetch(url).then(res => {
    if (res.status >= 400) {
      throw new Error('error fetching')
    }
    return res.text()
  })

// https://github.com/segmentio/is-url/blob/master/index.js
export const isUrl = (s: string): boolean => {
  /**
   * RegExps.
   * A URL must match #1 and then at least one of #2/#3.
   * Use two levels of REs to avoid REDOS.
   */
  const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/
  const localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/
  const nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/

  /**
   * Loosely validate a URL `string`.
   *
   * @param {String} string
   * @return {Boolean}
   */
  if (typeof s !== 'string') {
    return false
  }

  const match = s.match(protocolAndDomainRE)
  if (!match) {
    return false
  }

  const everythingAfterProtocol = match[1]
  if (!everythingAfterProtocol) {
    return false
  }

  if (
    localhostDomainRE.test(everythingAfterProtocol) ||
    nonLocalhostDomainRE.test(everythingAfterProtocol)
  ) {
    return true
  }

  return false
}

export interface Importer {
  (source: any): Promise<PostRecipe>
}
