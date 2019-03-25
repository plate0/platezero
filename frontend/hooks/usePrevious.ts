import { useRef, useEffect } from 'react'

export function usePrevious(val) {
  const ref = useRef()
  useEffect(() => {
    ref.current = val
  }, [val])
  return ref.current
}

