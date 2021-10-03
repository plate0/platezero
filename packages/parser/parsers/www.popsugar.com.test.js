const { parser } = require('../src/parser')
const RecipeParser = require('./www.popsugar.com')
const { testAsset } = require('../test')

describe('www.popsugar.com', () => {
  const importer = parser(RecipeParser)
  console.log('IMPROTER', importer)
  let result
  beforeAll(async () => {
    const source = await testAsset(
      'www.popsugar.com/Vegan-Gluten-Free-Pumpkin-Cookies.html'
    )
    result = await importer(source)
  })

  test('title', () => {
    expect(result.title).toEqual(
      'Bake a Batch of Flour-Free Pumpkin Chocolate Chip Cookies'
    )
  })

  test('subtitle', () => {
    expect(result.subtitle).toBeUndefined()
  })

  test('description', () => {
    expect(result.description).toEqual(
      `Love a slice of creamy pumpkin pie but don't love the calorie amount attached to it? Then grab a can of pumpkin and bake these cookies immediately. Soft,`
    )
  })

  test('image_url', () => {
    expect(result.image_url).toEqual(
      'https://media1.popsugar-assets.com/files/thumbor/euPqugtPsW3kLxVSRAsov1QNoAs/fit-in/728xorig/filters:format_auto-!!-:strip_icc-!!-/2015/08/18/676/n/1922729/13fff700_edit_img_facebook_post_image_file_845239_1360667147_FB-pumpkin-cookies.jpg'
    )
  })

  test('yield', () => {
    expect(result.yield).toEqual('20 cookies')
  })

  test('get duration', () => {
    expect(result.duration).toEqual(1200)
  })

  test('get preheats', () => {
    expect(result.preheats).toEqual([
      {
        name: 'oven',
        temperature: 350,
        unit: 'F',
      },
    ])
  })

  test('get ingredients', () => {
    expect(result.ingredient_lists).toHaveLength(1)
    expect(result.ingredient_lists[0].lines).toHaveLength(7)
  })

  test('get procedure', () => {
    expect(result.procedure_lists).toEqual([
      {
        lines: [
          {
            text:
              'Preheat your oven to 350°F, and line two baking sheets with parchment paper or a Silpat.',
          },
          {
            text:
              'Combine all the ingredients in a medium bowl, and mix until a smooth batter is formed. If adding the dark chocolate chips, fold them in now.',
          },
          {
            text:
              'Using a spoon, drop the batter onto the lined baking sheet and use the back of the spoon to spread them out into circles.',
          },
          {
            text:
              'Bake for 12-15 minutes, until the edges are slightly golden.',
          },
          {
            text:
              'Allow to cool completely before using a spatula to remove from the baking sheet.',
          },
        ],
      },
    ])
  })
})
