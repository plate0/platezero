export type Unit =
  | 'g'
  | 'mg'
  | 'kg'
  | 'oz'
  | 'lb'
  | 'c'
  | 'tbsp'
  | 'tsp'
  | 'l'
  | 'dl'
  | 'ml'

export const Units = [
  { label: 'gram', value: 'g' },
  { label: 'milligram', value: 'mg' },
  { label: 'kilogram', value: 'kg' },
  { label: 'pound', value: 'lb' },
  { label: 'cup', value: 'c' },
  { label: 'tablespoon', value: 'tbsp' },
  { label: 'teaspoon', value: 'tsp' },
  { label: 'liter', value: 'l' },
  { label: 'milliliter', value: 'ml' },
  { label: 'deciliter', value: 'dl' }
]

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
    case 'lb':
    case 'c':
    case 'tbsp':
    case 'tsp':
    case 'l':
    case 'dl':
    case 'ml':
      return unit
    case 'lbs':
      return 'lb'
    case 'tbsps':
      return 'tbsp'
    case 'tsps':
      return 'tsp'
    case 'cup':
      return 'c'
  }
}
