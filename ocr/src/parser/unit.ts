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
  | 'in'
  | 'ft'
  | 'cm'
  | 'm'

export const Units = [
  { label: '', value: undefined },
  { label: 'gram', value: 'g' },
  { label: 'milligram', value: 'mg' },
  { label: 'kilogram', value: 'kg' },
  { label: 'pound', value: 'lb' },
  { label: 'cup', value: 'c' },
  { label: 'tablespoon', value: 'tbsp' },
  { label: 'teaspoon', value: 'tsp' },
  { label: 'liter', value: 'l' },
  { label: 'milliliter', value: 'ml' },
  { label: 'deciliter', value: 'dl' },
  { label: 'ounce', value: 'oz' },
  { label: 'inch', value: 'in' },
  { label: 'foot', value: 'ft' },
  { label: 'centimeter', value: 'cm' },
  { label: 'meter', value: 'm' }
]

export const unitfy = (s?: string): Unit | undefined => {
  if (!s) {
    return undefined
  }
  if (s === 'T') {
    return 'tbsp'
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
    case 'in':
    case 'ft':
    case 'cm':
    case 'm':
      return unit
    case 'pound':
    case 'pounds':
    case 'lbs':
      return 'lb'
    case 'tablespoon':
    case 'tablespoons':
    case 'tbsps':
    case 'tbsp.':
      return 'tbsp'
    case 'teaspoon':
    case 'teaspoons':
    case 'tsps':
    case 'tsps.':
    case 'tsp.':
    case 't':
      return 'tsp'
    case 'cups':
    case 'cup':
    case 'cups.':
    case 'cup.':
      return 'c'
  }
  return undefined
}
