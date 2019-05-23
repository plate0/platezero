export function maybeNumber(
  x: number | string | undefined
): number | undefined {
  if (!x) {
    return undefined
  }
  const n = typeof x === 'number' ? x : parseInt(x, 10)
  if (isFinite(n)) {
    return n
  }
  return undefined
}
