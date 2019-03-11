import Fraction from 'fraction.js'

export const fraction = (s: string): Fraction => {
  switch (s) {
    case '½':
      s = '1/2'
    case '⅓':
      s = '1/3'
    case '⅔':
      s = '2/3'
    case '¼':
      s = '1/4'
    case '¾':
      s = '3/4'
    case '⅖':
      s = '2/5'
    case '⅗':
      s = '3/5'
    case '⅘':
      s = '4/5'
    case '⅙':
      s = '1/6'
    case '⅚':
      s = '5/6'
    case '⅐':
      s = '1/7'
    case '⅛':
      s = '1/8'
    case '⅜':
      s = '3/8'
    case '⅝':
      s = '5/8'
    case '⅞':
      s = '7/8'
    case '⅑':
      s = '1/9'
    case '⅒':
      s = '1/10'
  }
  return new Fraction(s)
}
