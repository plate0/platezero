import { Recipe } from '../models'
import * as _ from 'lodash'

export type Importer = (source: any) => Promise<Recipe>

export const toHTML = (f: any) => async (res: any) => f(await res.text())

export const toJSON = (f: any) => async (res: any) => f(await res.json())

// mapValues maps an object that has function values
// to their results, called with the arguments passed in
export const mapValues = (o: { [key: string]: Function | undefined }) => (
  ...args
) => _.mapValues(o, v => (v ? v(...args) : undefined))
