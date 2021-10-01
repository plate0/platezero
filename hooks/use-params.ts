import { NextRouter, useRouter } from 'next/router'

type UseParamRouter = {
  router: NextRouter
}

export function useParams<T>(): T & UseParamRouter {
  const router = useRouter()
  const { query } = router
  return { ...(query as unknown as T), router }
}
