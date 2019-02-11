import 'isomorphic-fetch'
import getConfig from 'next/config'
const {
  publicRuntimeConfig: {
    api: { url: API_URL }
  }
} = getConfig()

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

export const getUser = (username: string) => _fetch(`/users/${username}`)

export const createRecipe = (r: any) =>
  _fetch(`/user/recipe`, {
    method: 'POST',
    body: JSON.stringify(r)
  })

// const recipes = await fetch(`${host}/users/${username}/recipes`, options)

const _fetch = async <T>(uri: string, opts?: RequestInfo = {}): Promise<T> => {
  const options = {
    method: 'GET',
    ...headers,
    ...opts
  }
  const res = await fetch(`${API_URL}${uri}`, options)
  return (await res.json()) as T
}
