import { SeriousEats } from './serious-eats'
import { dom } from './html'
import { testAsset } from '../../test/readfile'

describe('Serious Eats import', () => {
  const importer = dom(SeriousEats)

  describe('chicken and rice', () => {
    let result
    beforeAll(async () => {
      const source = await testAsset(
        'www.seriouseats.com/serious-eats-halal-cart-style-chicken-and-rice-white-sauce-recipe.html'
      )
      result = await importer(source)
    })

    test('get title', () => {
      expect(result.title).toEqual(
        `Serious Eats' Halal Cart-Style Chicken and Rice With White Sauce Recipe`
      )
    })

    test('get subtitle', () => {
      expect(result.subtitle).toBeUndefined()
    })

    test('get description', () => {
      expect(result.description).toEqual(
        `Manhattan is home to many smells, but perhaps the most delicious is the chicken-y, savory scent that emanates from from the city's countless halal carts. Serving lunch to late-night, these carts dish up a container full of chicken rice that tastes like nothing else, crave-worthy and totally singular. To taste this particular chicken and rice you can get yourself to Midtown or try this home version by Kenji, a spot-on rendition of the street food classic. Marinated in oregano, lemon, and coriander, chicken thighs are browned, chopped into chunks and served over a pile turmeric-yellow rice. Of course, it wouldn't be halal-cart style without the ubiquitous (and none too fancy) salad of iceberg and tomatoes, and that mysterious sweet-sour-tangy white sauce that just has to be ladled all over the chicken and rice for true street-style authenticity.`
      )
    })

    test('get image_url', () => {
      expect(result.image_url).toEqual(
        'https://www.seriouseats.com/recipes/images/2011/12/20111205-ctb-halal-chicken-rice-primary.jpg'
      )
    })

    test('get yield', () => {
      expect(result.yield).toEqual('Serves 4 to 6')
    })

    test('get duration', () => {
      expect(result.duration).toEqual(3600)
    })

    test('get ingredients', () => {
      expect(result.ingredient_lists).toEqual([
        {
          name: 'For the chicken:',
          lines: [
            {
              name: 'fresh lemon juice',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tbsp'
            },
            {
              name: 'chopped fresh oregano',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tbsp'
            },
            {
              name: 'ground coriander seed',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'garlic cloves, roughly chopped (about 1 1/2 tablespoons)',
              quantity_numerator: 3,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'light olive oil',
              quantity_numerator: 1,
              quantity_denominator: 4,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: 'Kosher salt and freshly ground black pepper',
              quantity_numerator: undefined,
              quantity_denominator: undefined,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name:
                'boneless, skinless chicken thighs, trimmed of excess fat (6 to 8 thighs)',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'lb'
            },
            {
              name: 'vegetable or canola oil',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tbsp'
            }
          ]
        },
        {
          name: 'For the rice:',
          lines: [
            {
              name: 'unsalted butter',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tbsp'
            },
            {
              name: 'turmeric',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'ground cumin',
              quantity_numerator: 1,
              quantity_denominator: 4,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'long-grain or Basmati rice',
              quantity_numerator: 3,
              quantity_denominator: 2,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: 'chicken broth',
              quantity_numerator: 5,
              quantity_denominator: 2,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: 'Kosher salt and freshly ground black pepper',
              quantity_numerator: undefined,
              quantity_denominator: undefined,
              preparation: undefined,
              optional: false,
              unit: undefined
            }
          ]
        },
        {
          name: 'For the sauce:',
          lines: [
            {
              name: 'mayonnaise',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: 'Greek yogurt',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: 'sugar',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tbsp'
            },
            {
              name: 'white vinegar',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tbsp'
            },
            {
              name: 'lemon juice',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'chopped fresh parsley',
              quantity_numerator: 1,
              quantity_denominator: 4,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: 'Kosher salt and freshly ground black pepper',
              quantity_numerator: undefined,
              quantity_denominator: undefined,
              preparation: undefined,
              optional: false,
              unit: undefined
            }
          ]
        },
        {
          name: 'To serve:',
          lines: [
            {
              name: 'head iceberg lettuce, shredded',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'large tomato, cut into wedges',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name:
                'Fluffy pocketless pita bread, brushed in butter, lightly toasted, and cut into 1 × 3-inch strips',
              quantity_numerator: undefined,
              quantity_denominator: undefined,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'Harissa-style hot sauce, for serving',
              quantity_numerator: undefined,
              quantity_denominator: undefined,
              preparation: undefined,
              optional: false,
              unit: undefined
            }
          ]
        }
      ])
    })

    test('get procedure', () => {
      expect(result.procedure_lists).toEqual([
        {
          lines: [
            {
              text:
                '**For the chicken:** Combine the lemon juice, oregano, coriander, garlic, and olive oil in a blender. Blend until smooth. Season the marinade to taste with kosher salt and black pepper. Place the chicken in a 1-gallon zipper-lock bag and add half of the marinade (reserve the remaining marinade in the refrigerator). Turn the chicken to coat, seal the bag, and marinate the chicken in the refrigerator for at least 1 hour and up to 4 hours, turning occasionally to redistribute the marinade (see Note).'
            },
            {
              text:
                'Remove the chicken from the bag and pat it dry with paper towels. Season with kosher salt and pepper, going heavy on the pepper. Heat the oil in a 12-inch heavy-bottomed cast iron or stainless-steel skillet over medium-high heat until it is lightly smoking. Add the chicken pieces and cook without disturbing until they are lightly browned on the first side, about 4 minutes. Using tongs, flip the chicken. Reduce the heat to medium and cook until the chicken is cooked through and the center of each thigh registers 165°F. on an instant-read thermometer, about 6 minutes longer. Transfer the chicken to a cutting board and allow to cool for 5 minutes.'
            },
            {
              text:
                'Using a chef’s knife, roughly chop the chicken into 1/2- to 1/4-inch chunks. Transfer to a medium bowl, add the remaining marinade, cover loosely with plastic, and refrigerate while you cook the rice and prepare the sauce.'
            },
            {
              text:
                '**For the rice:** Melt the butter over medium heat in a large Dutch oven. Add the turmeric and cumin and cook until fragrant but not browned, about 1 minute. Add the rice and stir to coat. Cook, stirring frequently, until the rice is lightly toasted, about 4 minutes. Add the chicken broth. Season to taste with salt and pepper. Raise the heat to high and bring to a boil. Cover, reduce to a simmer, and cook for 15 minutes without disturbing. Remove from the heat and allow to rest until the water is completely absorbed and the rice is tender, about 15 minutes.'
            },
            {
              text:
                '**For the sauce:** In a small bowl, combine the mayonnaise, yogurt, sugar, vinegar, lemon juice, parsley, and 2 teaspoons black pepper. Whisk to combine. Season to taste with salt.'
            },
            {
              text:
                '**To serve:** Return the entire contents of the chicken bowl (chicken, marinade, and all juices) to the skillet. Cook over medium-high heat, stirring occasionally, until heated through. To serve, divide the rice, lettuce, tomato, and toasted pita bread evenly among four to six plates. Pile the chicken on top of the rice. Top with the white sauce and hot sauce. Serve immediately, passing extra sauce at the table.\n\n**Note:** Do not marinate the chicken longer than 4 hours or it’ll get a mushy texture. If you must delay cooking the chicken for any reason, remove it from the marinade, pat it dry with paper towels, and refrigerate until ready to cook.'
            }
          ]
        }
      ])
    })
  })

  describe('pizza', () => {
    let result
    beforeAll(async () => {
      const source = await testAsset(
        'www.seriouseats.com/detroit-style-pizza-recipe.html'
      )
      result = await importer(source)
    })

    test('get preheats', () => {
      expect(result.preheats).toEqual([
        {
          name: 'oven',
          temperature: 550,
          unit: 'F'
        }
      ])
    })
  })
})
