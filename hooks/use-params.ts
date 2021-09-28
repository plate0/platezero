import { useRouter } from 'next/router'

export function useParams<T>(): T {
  const { query } = useRouter()
  return (query as unknown) as T
}
