import { GetServerSidePropsContext } from 'next'
import { NextRouter, useRouter } from 'next/router'

type UseParamRouter = {
  router: NextRouter
}

export function useParams<T>(): T & UseParamRouter {
  const router = useRouter()
  const { query } = router
  return { ...(query as unknown as T), router }
}

export function getParams<T>(ctx: GetServerSidePropsContext): T {
  const { query } = ctx
  return { ...(query as unknown as T) }
}
