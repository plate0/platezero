import { PostRecipe } from '../../common/request-models'
import * as _ from 'lodash'
import nodeFetch from 'node-fetch'

export type Importer = (source: any) => Promise<PostRecipe>

export const fetch = (f: any) => {
  return async (url: string) => {
    return f(
      await nodeFetch(url).then(res => {
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
