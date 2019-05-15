export function maybeNumber(x: string | undefined): number | undefined {
  if (!x) {
    return undefined
  }
  const n = parseInt(x, 10)
  return isFinite(n) ? n : undefined
}
