import { ApolloClient, InMemoryCache } from '@apollo/client'
import { useCookie } from 'next-cookie'


export const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_ROOT,
  cache: new InMemoryCache(),
  headers: {

  }
})

export const useClient = () => {
  const cookie = useCookie()
  const token = cookie.get<string>('AUTH_TOKEN')
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_ROOT,
    cache: new InMemoryCache(),
    headers: {
      ...(
        token ? {Authorization: `Bearer ${token}`} : {}
      )
    }
  })
}