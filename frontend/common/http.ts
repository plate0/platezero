import 'isomorphic-fetch'
import fetch, { Response, RequestInit } from 'node-fetch'
import getConfig from 'next/config'
import { UserJSON, RecipeJSON } from '../models'
import { get } from 'lodash'
const API_URL = get(getConfig(), 'publicRuntimeConfig.api.url')

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

export interface PlateZeroRequestInfo extends RequestInit {
  token?: string
}

export interface LoginResponse {
  user: UserJSON
  token: string
}

export const login = ({
  username,
  password
}: {
  username: string
  password: string
}) =>
  _fetch<LoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  })

export const getCurrentUser = (opts?: PlateZeroRequestInfo) =>
  _fetch<UserJSON>(`/user`, {
    headers: authHeaders(opts ? opts.token : '')
  })

export const getUsers = (opts?: PlateZeroRequestInfo) =>
  _fetch<UserJSON[]>(`/users`, {
    headers: authHeaders(opts ? opts.token : '')
  })

export const getUser = (username: string, opts?: PlateZeroRequestInfo) =>
  _fetch<UserJSON>(`/users/${username}`, {
    headers: authHeaders(opts ? opts.token : '')
  })

export const getUserRecipes = (username: string, opts?: PlateZeroRequestInfo) =>
  _fetch(`/users/${username}/recipes`, {
    headers: authHeaders(opts ? opts.token : '')
  })

export const getRecipe = (
  username: string,
  slug: string,
  opts?: PlateZeroRequestInfo
) =>
  _fetch(`/users/${username}/recipes/${slug}`, {
    headers: authHeaders(opts ? opts.token : '')
  })

export const getRecipeVersion = (
  username: string,
  slug: string,
  versionId: number,
  opts?: PlateZeroRequestInfo
) =>
  _fetch(`/users/${username}/recipes/${slug}/versions/${versionId}`, {
    headers: authHeaders(opts ? opts.token : '')
  })

export const createRecipe = (recipe: any, opts?: PlateZeroRequestInfo) =>
  _fetch<RecipeJSON>(`/user/recipe`, {
    body: JSON.stringify(recipe),
    method: 'POST',
    headers: authHeaders(opts ? opts.token : '')
  })

const _fetch = async <T>(uri: string, opts: RequestInit = {}): Promise<T> => {
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
