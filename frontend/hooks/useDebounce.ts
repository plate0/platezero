import { useState, useEffect } from 'react'

// useDebounce is a React hook which debounces access to a frequently-changing
// value. For example, you might use it on a text field before fetching data
// from an API, such as:
//
//    const [search, setSearch] = useState('')
//    const debouncedSearch = useDebounce(search, 500)
//
//    useEffect(() => {
//      loadSearchResults(debouncedSearch)
//    }, [debouncedSearch])
//
// With this approach, even if `search` is updated each time the user types a
// key, the API call will only be run at most every 500ms.
export function useDebounce(val, delay: number) {
  const [debounced, setDebounced] = useState(val)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(val)
    }, delay)
    return () => clearTimeout(handler)
  }, [val])
  return debounced
}
