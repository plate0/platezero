import 'isomorphic-fetch'
import getConfig from 'next/config'
import * as _ from 'lodash'
import { UserJSON, RecipeJSON, RecipeVersionJSON } from '../models'
import { PostRecipe, RecipeVersionPatch } from './request-models'
import { HttpStatus } from './http-status'
import { get } from 'lodash'
import { getAuth } from './auth'
import cookie from 'js-cookie'
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

const refreshToken = async (token: string) => {
  const res = await fetch(`${API_URL}/login/refresh`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ token })
  })
  return res.json()
}

const handleError = async (res: Response): Promise<any> => {
  if (res.status === HttpStatus.NoContent) {
    return Promise.resolve()
  }
  if (res.status >= 200 && res.status < 400) {
    return res.json()
  }
  const messages = (await res.json()).errors
  throw new PlateZeroApiError(messages, res.status)
}

export class PlateZeroApiError extends Error {
  constructor(readonly messages: string[], readonly statusCode: number) {
    super('API error')
  }
}

export interface LoginResponse {
  user: UserJSON
  token: string
  refreshToken: string
}

class Api {
  private token?: string
  private refresh?: string

  private async _fetch<T>(
    uri: string,
    opts: RequestInit = {},
    retry = true
  ): Promise<T> {
    const options = {
      method: opts.method || 'GET',
      headers: {
        ...headers,
        ...(opts.headers || {}),
        ...authHeaders(this.token)
      },
      body: opts.body
    }
    const res = await fetch(`${API_URL}${uri}`, options)
    if (
      retry &&
      res.status === HttpStatus.Unauthorized &&
      this.token &&
      this.refresh
    ) {
      const { token } = await refreshToken(this.refresh)
      this.updateAuth(token)
      // retry
      return this._fetch(uri, opts, false)
    }
    return handleError(res)
  }

  // Load tokens from cookie
  public loadAuth(ctx = undefined) {
    const { token, refresh } = getAuth(ctx)
    this.token = token
    this.refresh = refresh
  }

  public setAuth(token: string, refresh: string) {
    this.token = token
    this.refresh = refresh
  }

  private updateAuth(token: string) {
    this.token = token
    cookie.set('auth', JSON.stringify({ token, refresh: this.refresh }))
  }

  createUser = (body: {
    username: string
    password: string
    email: string
  }): Promise<UserJSON> =>
    this._fetch<UserJSON>(`/users`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers
    })

  login = ({ username, password }: { username: string; password: string }) =>
    this._fetch<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })

  getCurrentUser = (opts: RequestInit = {}) =>
    this._fetch<UserJSON>(`/user`, opts)

  getUsers = (opts: RequestInit = {}) => this._fetch<UserJSON[]>(`/users`, opts)

  getUser = (username: string, opts: RequestInit = {}) =>
    this._fetch<UserJSON>(`/users/${username}`, opts)

  getUserRecipes = (
    username: string,
    query?: string,
    opts: RequestInit = {}
  ) => {
    const q = query ? `?q=${query}` : ''
    return this._fetch(`/users/${username}/recipes${q}`, opts)
  }

  getRecipe = (
    username: string,
    slug: string,
    opts: RequestInit = {}
  ): Promise<RecipeJSON> =>
    this._fetch<RecipeJSON>(`/users/${username}/recipes/${slug}`, opts)

  getRecipeVersions = (
    username: string,
    slug: string,
    opts: RequestInit = {}
  ): Promise<RecipeVersionJSON[]> =>
    this._fetch<RecipeVersionJSON[]>(
      `/users/${username}/recipes/${slug}/versions`,
      opts
    )

  getRecipeVersion = (
    username: string,
    slug: string,
    versionId: number,
    opts: RequestInit = {}
  ) =>
    this._fetch<RecipeVersionJSON>(
      `/users/${username}/recipes/${slug}/versions/${versionId}`,
      opts
    )

  createRecipe = (recipe: PostRecipe, opts: RequestInit = {}) =>
    this._fetch<RecipeJSON>(`/user/recipe`, {
      ...opts,
      body: JSON.stringify(recipe),
      method: 'POST'
    })

  importUrl = (url: string, opts: RequestInit = {}) =>
    this._fetch<RecipeJSON>(`/user/import/url`, {
      ...opts,
      body: JSON.stringify({ url }),
      method: 'POST'
    })

  importFiles = (body: any, opts: RequestInit = {}) =>
    fetch(`${API_URL}/user/import/file`, {
      ...opts,
      body,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...authHeaders(this.token)
      }
    }).then(handleError)

  patchBranch = (
    slug: string,
    branch: string,
    patch: RecipeVersionPatch,
    opts: RequestInit = {}
  ) =>
    this._fetch<RecipeVersionJSON>(`/user/recipes/${slug}/branches/${branch}`, {
      ...opts,
      body: JSON.stringify(patch),
      method: 'PATCH'
    })

  deleteRecipe = (slug: string, opts: RequestInit = {}) =>
    this._fetch(`/user/recipes/${slug}`, {
      ...opts,
      method: 'DELETE'
    })

  patchRecipe = (slug: string, body: object, opts: RequestInit = {}) =>
    this._fetch(`/user/recipes/${slug}`, {
      ...opts,
      method: 'PATCH',
      body: JSON.stringify(body)
    })
}

export const api = new Api()
