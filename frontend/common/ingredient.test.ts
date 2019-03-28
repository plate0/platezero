import { parse } from './ingredient'

test('parse 1', () => {
  expect(parse('2 tablespoons fresh lemon juice')).toEqual({
    name: 'fresh lemon juice',
    quantity_numerator: 2,
    quantity_denominator: 1,
    preparation: undefined,
    optional: false,
    unit: 'tbsp'
  })
})

test('parse 2', () => {
  expect(parse('1 tablespoon chopped fresh oregano')).toEqual({
    name: 'chopped fresh oregano',
    quantity_numerator: 1,
    quantity_denominator: 1,
    preparation: undefined,
    optional: false,
    unit: 'tbsp'
  })
})

test('parse 3', () => {
  expect(parse('1/2 teaspoon ground coriander seed')).toEqual({
    name: 'ground coriander seed',
    quantity_numerator: 1,
    quantity_denominator: 2,
    preparation: undefined,
    optional: false,
    unit: 'tsp'
  })
})

test('parse 4', () => {
  expect(
    parse('3 garlic cloves, roughly chopped (about 1 1/2 tablespoons)')
  ).toEqual({
    name: 'garlic cloves',
    quantity_numerator: 3,
    quantity_denominator: 1,
    preparation: 'roughly chopped (about 1 1/2 tablespoons)',
    optional: false,
    unit: undefined
  })
})

test('parse 5', () => {
  expect(parse('1/4 cup light olive oil')).toEqual({
    name: 'light olive oil',
    quantity_numerator: 1,
    quantity_denominator: 4,
    preparation: undefined,
    optional: false,
    unit: 'c'
  })
})

test('parse 6', () => {
  expect(parse('Kosher salt and freshly ground black pepper')).toEqual({
    name: 'Kosher salt and freshly ground black pepper',
    quantity_numerator: undefined,
    quantity_denominator: undefined,
    preparation: undefined,
    optional: false,
    unit: undefined
  })
})

test('parse 7', () => {
  expect(
    parse(
      '2 pounds boneless, skinless chicken thighs, trimmed of excess fat (6 to 8 thighs)'
    )
  ).toEqual({
    name: 'boneless',
    quantity_numerator: 2,
    quantity_denominator: 1,
    preparation:
      'skinless chicken thighs, trimmed of excess fat (6 to 8 thighs)',
    optional: false,
    unit: 'lb'
  })
})

test('parse 8', () => {
  // The default regex reads in `4 6`, which is not a valid number.
  // We've expanded the amount parsing to also check for dashes (can be
  // expanded further in the future), and then not use the second number
  // if a dash is present.
  expect(parse('4 6-inch whole-wheat or corn tortillas (optional)')).toEqual({
    name: '6-inch whole-wheat or corn tortillas (optional)',
    quantity_numerator: 4,
    quantity_denominator: 1,
    preparation: undefined,
    optional: true,
    unit: undefined
  })
})

// This is a little broken, but expected
test('parse 9', () => {
  expect(parse('2-3 tsp olive oil')).toEqual({
    name: '-3 tsp olive oil',
    quantity_numerator: 2,
    quantity_denominator: 1,
    preparation: undefined,
    optional: false,
    unit: undefined
  })
})
