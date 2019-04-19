import { PostRecipe } from '../../common/request-models'
import * as _ from 'lodash'
import nodeFetch from 'node-fetch'

export type Importer = (source: any) => Promise<PostRecipe>

// Pretend to be Chrome so App Link redirects bring us to a website
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'

const headers = {
  'user-agent': USER_AGENT
}

export const fetch = (f: any) => {
  return async (url: string) => {
    return f(
      await nodeFetch(url, { headers }).then(res => {
        if (res.status >= 400) {
          throw new Error('error fetching')
        }
        return res
      })
    )
  }
}

export const toHTML = (f: any) => async (res: any) => f(await res.text())

export const toJSON = (f: any) => async (res: any) => f(await res.json())

// mapValues maps an object that has function values
// to their results, called with the arguments passed in
export const mapValues = (o: { [key: string]: Function | undefined }) => (
  ...args
) => _.mapValues(o, v => (v ? v(...args) : undefined))
