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

const authHeaders = (token?: string) =>
  token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {}

export interface PlateZeroRequestInfo extends RequestInfo {
  token?: string
}

export const login = ({
  username,
  password
}: {
  username: string
  password: string
}) =>
  _fetch('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  })

export const getUser = (username: string, opts?: PlateZeroRequestInfo) =>
  _fetch(`/users/${username}`, {
    headers: authHeaders(opts ? opts.token : '')
  })

export const createRecipe = (r: any) =>
  _fetch(`/user/recipe`, {
    method: 'POST',
    body: JSON.stringify(r)
  })

// const recipes = await fetch(`${host}/users/${username}/recipes`, options)

const _fetch = async <T>(uri: string, opts?: RequestInfo = {}): Promise<T> => {
  console.log('FETCH TEST', opts)
  const options = {
    method: 'GET',
    headers: {
      ...headers,
      ...(opts.headers || {})
    },
    ...opts
  }
  const res = await fetch(`${API_URL}${uri}`, options)
  return (await res.json()) as T
}
