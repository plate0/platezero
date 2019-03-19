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
    quantity_numerator: 1,
    quantity_denominator: 1,
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

// to be continued...
/*
1 tablespoon vegetable or canola oil
For the rice:
2 tablespoons unsalted butter
1/2 teaspoon turmeric
1/4 teaspoon ground cumin
1 1/2 cups long-grain or Basmati rice
2 1/2 cups chicken broth
Kosher salt and freshly ground black pepper
For the sauce:
1/2 cup mayonnaise
1/2 cup Greek yogurt
1 tablespoon sugar
2 tablespoons white vinegar
1 teaspoon lemon juice
1/4 cup chopped fresh parsley
Kosher salt and freshly ground black pepper
To serve:
1 head iceberg lettuce, shredded
1 large tomato, cut into wedges
Fluffy pocketless pita bread, brushed in butter, lightly toasted, and cut into 1 × 3-inch strips
Harissa-style hot sauce, for serving
   */
