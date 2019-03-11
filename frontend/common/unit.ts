export type Unit =
  | 'g'
  | 'mg'
  | 'kg'
  | 'oz'
  | 'lbs'
  | 'c'
  | 'tbsp'
  | 'tsp'
  | 'l'
  | 'dl'
  | 'ml'

export const unitfy = (s?: string): Unit | undefined => {
  if (!s) {
    return undefined
  }
  const unit = s.toLowerCase()
  switch (unit) {
    case 'oz':
    case 'g':
    case 'mg':
    case 'kg':
    case 'lbs':
    case 'c':
    case 'tbsp':
    case 'tsp':
    case 'l':
    case 'dl':
    case 'ml':
      return unit
    case 'lb':
      return 'lbs'
    case 'tbsps':
      return 'tbsp'
    case 'tsps':
      return 'tsp'
    case 'cup':
      return 'c'
  }
}
