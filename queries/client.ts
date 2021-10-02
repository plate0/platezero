import { ApolloClient, InMemoryCache } from '@apollo/client'
import { GetServerSidePropsContext, NextApiRequest } from 'next'
import { useCookie } from 'next-cookie'

const CookieName = 'AUTH_TOKEN'

export const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_ROOT,
  cache: new InMemoryCache()
})

export const useClient = () => {
  const cookie = useCookie()
  const token = cookie.get<string>('AUTH_TOKEN')
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_ROOT,
    cache: new InMemoryCache(),
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })
}

export const getClient = (
  ctxOrReq: NextApiRequest | GetServerSidePropsContext
) => {
  const token = getToken(ctxOrReq)
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_ROOT,
    cache: new InMemoryCache(),
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })
}

function isApiRequest(req: any): req is NextApiRequest {
  return !!req.cookies
}

function isServerSide(ctx: any): ctx is GetServerSidePropsContext {
  return !!ctx.req
}

const getToken = (ctx: NextApiRequest | GetServerSidePropsContext): string => {
  if (isApiRequest(ctx)) {
    return ctx.cookies[CookieName]
  } else if (isServerSide(ctx)) {
    return ctx.req.cookies[CookieName]
  }
  return ''
}
