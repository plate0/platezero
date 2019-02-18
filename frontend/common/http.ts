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

const handleError = async (res: Response): Promise<any> => {
  if (res.status === 200) {
    return res.json()
  } else {
    let error = 'Unexpected error from server'
    try {
      error = (await res.json()).error
    } catch {
      // Do Nothing
    }
    throw new Error(error)
  }
}

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

export const createRecipe = (r: any, opts?: PlateZeroRequestInfo) =>
  _fetch(`/user/recipe`, {
    body: JSON.stringify(r),
    method: 'POST',
    headers: authHeaders(opts ? opts.token : '')
  })

// const recipes = await fetch(`${host}/users/${username}/recipes`, options)

const _fetch = async <T>(uri: string, opts?: RequestInfo = {}): Promise<T> => {
  const options = {
    method: opts.method || 'GET',
    headers: {
      ...headers,
      ...(opts.headers || {})
    },
    body: opts.body
  }
  return await fetch(`${API_URL}${uri}`, options).then(handleError)
}
