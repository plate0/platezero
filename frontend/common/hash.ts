export const hash = (s: string): string => {
  let hash = 0
  if (s.length === 0) {
    return 'pz' + hash
  }
  for (let i = 0; i < s.length; i++) {
    var char = s.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return 'pz' + hash
}
