import 'isomorphic-fetch'
import cookie from 'js-cookie'
import * as _ from 'lodash'
import { get } from 'lodash'
import getConfig from 'next/config'
import { stringify } from 'query-string'
import {
  FavoriteJSON,
  IngredientListJSON,
  NoteJSON,
  ProcedureListJSON,
  RecipeJSON,
  RecipeSearchDocumentJSON,
  RecipeVersionJSON,
  UserJSON
} from '../models'
import { getAuth } from './auth'
import { HttpStatus } from './http-status'
import { NotePatch, PostRecipe, RecipeVersionPatch } from './request-models'
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
  let messages
  if (res.bodyUsed) {
    messages = (await res.clone().json()).errors
  } else {
    messages = [`${res.status}: ${res.statusText}`]
  }
  console.error(`api: ${messages.join('; ')}`)
  throw new PlateZeroApiError(res.clone(), messages, res.status)
}

export class PlateZeroApiError extends Error {
  constructor(
    readonly res: Response,
    readonly messages: string[],
    readonly statusCode: number
  ) {
    super('API error')
  }
}

export const getErrorMessages = (err: Error): string[] => {
  if (err instanceof PlateZeroApiError) {
    return err.messages
  }
  return [err.message]
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
    sort?: string,
    opts: RequestInit = {}
  ) => {
    const query = stringify({ sort })
    return this._fetch<RecipeJSON[]>(
      `/users/${username}/recipes${query ? '?' + query : ''}`,
      opts
    )
  }

  searchUserRecipes = (
    {
      username,
      q,
      sort
    }: {
      username: string
      q: string
      sort?: string
    },
    opts: RequestInit = {}
  ) => {
    const qs = stringify({ username, q, sort })
    return this._fetch<RecipeSearchDocumentJSON[]>(`/search?${qs}`, opts)
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

  importFiles = async (body: any, opts: RequestInit = {}): Promise<any> => {
    const res = await fetch(`${API_URL}/user/import/file`, {
      ...opts,
      body,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...authHeaders(this.token)
      }
    })
    const { recipe, text } = await handleError(res)
    return { httpStatus: res.status, recipe: recipe, text: text }
  }

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

  uploadPublicImage = (
    body: any,
    opts: RequestInit = {}
  ): Promise<{ url: string }> =>
    fetch(`${API_URL}/user/images`, {
      ...opts,
      body,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...authHeaders(this.token)
      }
    }).then(handleError)

  updateUser = (body: object, opts: RequestInit = {}) =>
    this._fetch<UserJSON>('/user', {
      ...opts,
      body: JSON.stringify(body),
      method: 'PUT',
      headers: { Accept: 'application/json', ...authHeaders(this.token) }
    })

  createNote = (note: NoteJSON, opts: RequestInit = {}) =>
    this._fetch<NoteJSON>(`/user/notes`, {
      ...opts,
      body: JSON.stringify(note),
      method: 'POST'
    })

  getRecipeNotes = (
    username: string,
    slug: string,
    opts: RequestInit = {}
  ): Promise<NoteJSON[]> =>
    this._fetch<NoteJSON[]>(`/users/${username}/recipes/${slug}/notes`, opts)

  patchNote = (id: number, note: NotePatch, opts: RequestInit = {}) =>
    this._fetch<NoteJSON>(`/user/notes/${id}`, {
      ...opts,
      body: JSON.stringify(note),
      method: 'PATCH'
    })

  deleteNote = (id: number, opts: RequestInit = {}) =>
    this._fetch(`/user/notes/${id}`, { ...opts, method: 'DELETE' })

  getFavorites = (username: string, opts: RequestInit = {}) =>
    this._fetch<FavoriteJSON[]>(`/users/${username}/favorites`, opts)

  addFavorite = (recipe_id: number, opts: RequestInit = {}) =>
    this._fetch<FavoriteJSON>(`/user/favorites`, {
      ...opts,
      body: JSON.stringify({ recipe_id }),
      method: 'POST'
    })

  removeFavorite = (recipeId: number, opts: RequestInit = {}) =>
    this._fetch<any>(`/user/favorites/${recipeId}`, {
      ...opts,
      method: 'DELETE'
    })

  getRecipes = async (
    { username, q, sort }: { username: string; q?: string; sort?: string },
    opts: RequestInit = {}
  ) => {
    if (q) {
      return _.map(
        await this.searchUserRecipes({ username, q, sort }, opts),
        'recipe'
      )
    }
    return await this.getUserRecipes(username, sort, opts)
  }

  createIngredientLists = (
    lists: IngredientListJSON[],
    versionId: number,
    opts: RequestInit = {}
  ) => {
    this._fetch<IngredientListJSON>(`/user/versions/${versionId}/ingredients`, {
      ...opts,
      body: JSON.stringify(lists),
      method: 'POST'
    })
  }

  createProcedureLists = (
    lists: ProcedureListJSON[],
    versionId: number,
    opts: RequestInit = {}
  ) => {
    this._fetch<ProcedureListJSON>(`/user/versions/${versionId}/procedures`, {
      ...opts,
      body: JSON.stringify(lists),
      method: 'POST'
    })
  }
}

export const api = new Api()
