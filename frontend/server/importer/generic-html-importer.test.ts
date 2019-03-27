import { GenericHTML } from './generic-html-importer'
import { dom } from './html'
import { readFileSync } from 'fs'

describe('Generic HTML import', () => {
  describe('www.wholelivinglauren.com', () => {
    let source: string
    let importer = dom(GenericHTML)

    beforeEach(() => {
      source = readFileSync(
        'test/assets/www.wholelivinglauren.com/creamy-vegan-pumpkin-soup.html',
        { encoding: 'utf8' }
      )
    })

    test('title', async () => {
      const { title } = await importer(source)
      expect(title).toEqual('Creamy Vegan Pumpkin Soup')
    })

    test('description', async () => {
      const { description } = await importer(source)
      expect(description).toEqual(
        `Boy oh boy do I have something tasty (and super easy) for you today. I've said it before and I'll say it again. Soup is my jam. It's one of my absolute favorite foods. And this time of year there is nothing better than a piping hot bowl of creamy, comforting soup. Add pumpkin to the mix and WHOA...c`
      )
    })

    test('image_url', async () => {
      const { image_url } = await importer(source)
      expect(image_url).toEqual(
        'http://static1.squarespace.com/static/530e90a4e4b0340ce5266903/530e97a4e4b0fe3537f031c0/5817fd93c534a52382cccd35/1534429575718/fullsizeoutput_47b.jpeg?format=1500w'
      )
    })

    test('yield', async () => {
      const { yield: yld } = await importer(source)
      expect(yld).toEqual('4-5')
    })

    test('duration', async () => {
      const { duration } = await importer(source)
      expect(duration).toBeUndefined()
    })

    test('ingredient_lists', async () => {
      const { ingredient_lists } = await importer(source)
      expect(ingredient_lists).toEqual([
        {
          lines: [
            {
              name: 'olive oil',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tbsp'
            },
            {
              name: 'medium yellow onion',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: 'chopped',
              optional: false,
              unit: undefined
            },
            {
              name: 'cloves garlic',
              quantity_numerator: 3,
              quantity_denominator: 1,
              preparation: 'minced',
              optional: false,
              unit: undefined
            },
            {
              name: 'cans 100% pumpkin puree (not pumpkin pie mix)',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'low sodium vegetable stock',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: 'can lite coconut milk',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'maple syrup',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tbsp'
            },
            {
              name: 'ground ginger',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'cinnamon',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'ground nutmeg',
              quantity_numerator: 1,
              quantity_denominator: 4,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'sea salt',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'pinch of cayenne pepper (optional)',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: true,
              unit: undefined
            }
          ]
        }
      ])
    })

    test('procedure_lists', async () => {
      const { procedure_lists } = await importer(source)
      expect(procedure_lists).toEqual([
        {
          lines: [
            {
              text:
                'Heat olive oil in a large pot over medium-high heat and add onion and garlic. Cook for about 3-5 minutes, until onions become translucent. '
            },
            {
              text:
                'Carefully stir in the pumpkin, vegetable stock, coconut milk, maple syrup, ginger, cinnamon, nutmeg, salt, and cayenne (if using). '
            },
            {
              text:
                'Bring to a boil, then turn the heat to low and simmer for about 20 minutes, until the soup has reduced and thickened slightly.'
            },
            {
              text:
                'Puree with an immersion blender or in a stand blender until very smooth. Garnish with pepitas, cashew cream, and hot sauce. '
            },
            { text: 'Enjoy!' }
          ]
        }
      ])
    })
  })

  describe('paleogrubs.com', () => {
    let source: string
    let importer = dom(GenericHTML)

    beforeEach(() => {
      source = readFileSync(
        'test/assets/paleogrubs.com/best-paleo-brownie-recipe.html',
        { encoding: 'utf8' }
      )
    })

    test('title', async () => {
      const { title } = await importer(source)
      expect(title).toEqual(
        'The Best Fudgy Paleo Brownies Ever – Easy and Flourless Brownie Recipe'
      )
    })

    test('ingredient_lists', async () => {
      const { ingredient_lists } = await importer(source)
      expect(ingredient_lists).toEqual([
        {
          lines: [
            {
              name: 'almond butter',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: 'grade-A maple syrup',
              quantity_numerator: 1,
              quantity_denominator: 3,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: 'egg',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'ghee',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tbsp'
            },
            {
              name: 'vanilla',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'cocoa powder',
              quantity_numerator: 1,
              quantity_denominator: 3,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: 'pure baking soda',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            }
          ]
        }
      ])
    })

    test('procedure_lists', async () => {
      const { procedure_lists } = await importer(source)
      expect(procedure_lists).toEqual([
        {
          lines: [
            {
              text:
                'Preheat the oven to 325 degrees F. In a large bowl, whisk together the almond butter, syrup, egg, ghee, and vanilla. Stir in the cocoa powder and baking soda.'
            },
            {
              text:
                'Pour the batter into a 9-inch baking pan. Bake for 20-23 minutes, until the brownie is done, but still soft in the middle.'
            }
          ]
        }
      ])
    })
  })

  describe('kitchen.benburwell.com', () => {
    let source: string
    let importer = dom(GenericHTML)

    beforeEach(() => {
      source = readFileSync(
        'test/assets/kitchen.benburwell.com/palak-paneer.html',
        { encoding: 'utf8' }
      )
    })

    test('title', async () => {
      const { title } = await importer(source)
      expect(title).toEqual('Palak Paneer')
    })

    test('ingredient_lists', async () => {
      const { ingredient_lists } = await importer(source)
      expect(ingredient_lists).toEqual([
        {
          lines: [
            {
              name: 'turmeric',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'salt',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'canola oil',
              quantity_numerator: 6,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tbsp'
            },
            {
              name: 'paneer',
              quantity_numerator: 24,
              quantity_denominator: 1,
              preparation: 'cut into 1/2 inch cubes',
              optional: false,
              unit: 'oz'
            },
            {
              name: 'spinach',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: 'pureed',
              optional: false,
              unit: 'lb'
            },
            {
              name: 'medium white onion',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: 'finely diced',
              optional: false,
              unit: undefined
            },
            {
              name: 'fresh ginger',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: 'minced',
              optional: false,
              unit: 'in'
            },
            {
              name: 'garlic cloves',
              quantity_numerator: 8,
              quantity_denominator: 1,
              preparation: 'minced',
              optional: false,
              unit: undefined
            },
            {
              name: 'garam masala',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'ground coriander',
              quantity_numerator: 4,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'ground cumin',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'plain yogurt',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: 'rice',
              quantity_numerator: 3,
              quantity_denominator: 2,
              preparation: 'cooked',
              optional: false,
              unit: 'c'
            }
          ]
        }
      ])
    })

    test('procedure_lists', async () => {
      const { procedure_lists } = await importer(source)
      expect(procedure_lists).toEqual([
        {
          lines: [
            {
              text:
                'Whisk the turmeric, salt, and canola oil together. Add the paneer cubes, toss, and marinate while prepping other ingredients.'
            },
            {
              text:
                'In a large skillet, brown the paneer cubes on all sides over medium heat and remove from pan.'
            },
            {
              text:
                'Add the onion, ginger, and garlic to the pan and saute until toffee colored. This will take a solid 30 minutes, maybe more.'
            },
            {
              text:
                'Add the garam masala, ground coriander, and ground cumin and cook for another 3-5 minutes.'
            },
            {
              text:
                'Incorporate the spinach and season with salt. Cook for 10 minutes, adding water as needed.'
            },
            {
              text:
                'Reduce heat to low. Slowly stir in yogurt. Mix in browned paneer and cover to warm, about 5 minutes.'
            },
            {
              text: 'Serve over rice.'
            }
          ]
        }
      ])
    })
  })

  describe('detoxinista.com', () => {
    let source: string
    let importer = dom(GenericHTML)

    beforeEach(() => {
      source = readFileSync(
        'test/assets/detoxinista.com/ingredient-peanut-butter-cookies.html',
        { encoding: 'utf8' }
      )
    })

    test('title', async () => {
      const { title } = await importer(source)
      expect(title).toEqual('4-Ingredient Peanut Butter Cookies')
    })

    test('ingredient_lists', async () => {
      const { ingredient_lists } = await importer(source)
      expect(ingredient_lists).toEqual([
        {
          lines: [
            {
              name: 'peanut butter',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: 'coconut sugar',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: 'egg (or a flax egg; see notes)',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'baking soda',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            }
          ]
        }
      ])
    })

    test('procedure_lists', async () => {
      const { procedure_lists } = await importer(source)
      expect(procedure_lists).toEqual([
        {
          lines: [
            {
              text:
                'Preheat the oven to 350ºF and line a baking sheet with parchment paper.'
            },
            {
              text:
                'In a large bowl, combine the peanut butter, coconut sugar, egg, and baking soda. Add a pinch of salt, if desired. (If using unsalted peanut butter, add at least 1/4 to 1/2 teaspoon of fine salt to compensate.)'
            },
            {
              text:
                'Drop the cookie dough by the tablespoon onto the lined baking sheet, then use a fork to flatten them in a criss-cross shape. Once all of the cookies have been flattened, bake them until lightly golden, about 10 to 12 minutes at 350ºF.'
            },
            {
              text:
                'Let the cookies cool on the pan for 10 minutes, then transfer them to a wire rack to cool completely. These cookies can be served at room temperature, or place them in the freezer to firm up even more. My husband likes to eat them straight from the freezer for a crispy texture.'
            },
            {
              text:
                'Store the cookies at room temperature for up to 3 days, or in the fridge or freezer for up to 3 months in an airtight container.'
            }
          ]
        }
      ])
    })
  })

  describe('avocadopesto.com', () => {
    let source: string
    let importer = dom(GenericHTML)

    beforeEach(() => {
      source = readFileSync(
        'test/assets/avocadopesto.com/roasted-cauliflower-soup.html',
        { encoding: 'utf8' }
      )
    })

    test('ingredient_lists', async () => {
      const { ingredient_lists } = await importer(source)
      expect(ingredient_lists).toEqual([
        {
          lines: [
            {
              name: 'head cauliflower chopped into florets',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'head garlic',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'extra virgin olive oil divided',
              quantity_numerator: 3,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tbsp'
            },
            {
              name: 'carrot peeled and diced',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'stalk celery diced',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'small yellow onion diced',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'smoked paprika optional',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: true,
              unit: 'tsp'
            },
            {
              name: 'hot smoked paprika optional',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: true,
              unit: 'tsp'
            },
            {
              name: 'vegetable broth',
              quantity_numerator: 4,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: 'can coconut milk (optional',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation:
                'use almond flour instead if sensitive to the taste of coconut milk)',
              optional: true,
              unit: undefined
            },
            {
              name: 'nutritional yeast',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tbsp'
            },
            {
              name: 'For garnish:',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'handful chopped parsley',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            }
          ]
        }
      ])
    })
  })

  describe('kblog.lunchboxbunch.com', () => {
    let source: string
    let importer = dom(GenericHTML)

    beforeEach(() => {
      source = readFileSync(
        'test/assets/kblog.lunchboxbunch.com/easy-sweet-potato-veggie-burgers-with.html',
        { encoding: 'utf8' }
      )
    })

    test('ingredient_lists', async () => {
      const { ingredient_lists } = await importer(source)
      expect(ingredient_lists).toEqual([
        {
          lines: [
            {
              name: 'medium sweet potato',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: 'baked and peeled',
              optional: false,
              unit: undefined
            },
            {
              name: 'oz. cooked white beans (canned',
              quantity_numerator: 16,
              quantity_denominator: 1,
              preparation: 'drained and rinsed)',
              optional: false,
              unit: undefined
            },
            {
              name: 'white onion',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: 'chopped',
              optional: false,
              unit: 'c'
            },
            {
              name: '-3 Tbsp tahini',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'apple cider vinegar',
              quantity_numerator: 3,
              quantity_denominator: 4,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'garlic powder',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name:
                '- 1 tsp chipotle powder (or cajun spice) (use more for spicier burgers)',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'salt',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'black pepper (add more for more bite!)',
              quantity_numerator: 1,
              quantity_denominator: 4,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'nutritional yeast OR any flour (try oat flour)',
              quantity_numerator: 1,
              quantity_denominator: 3,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: '- 1 cup finely chopped greens (kale',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: 'spinach, parsley)',
              optional: false,
              unit: undefined
            },
            {
              name: 'toppings: avocado',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: 'tomato, vegenaise, burger buns, greens',
              optional: false,
              unit: undefined
            },
            {
              name: 'skillet: 1 Tbsp oil ( extra virgin olive oil',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: 'coconut oil, or other)',
              optional: false,
              unit: undefined
            },
            {
              name: 'optional: Panko bread crumbs for crispy coating',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: true,
              unit: undefined
            },
            {
              name: 'medium sweet potato',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: 'baked and peeled',
              optional: false,
              unit: undefined
            },
            {
              name: 'oz. cooked white beans (canned',
              quantity_numerator: 16,
              quantity_denominator: 1,
              preparation: 'drained and rinsed)',
              optional: false,
              unit: undefined
            },
            {
              name: 'white onion',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: 'chopped',
              optional: false,
              unit: 'c'
            },
            {
              name: '-3 Tbsp tahini',
              quantity_numerator: 2,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'apple cider vinegar',
              quantity_numerator: 3,
              quantity_denominator: 4,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'garlic powder',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name:
                '- 1 tsp chipotle powder (or cajun spice) (use more for spicier burgers)',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: undefined,
              optional: false,
              unit: undefined
            },
            {
              name: 'salt',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'black pepper (add more for more bite!)',
              quantity_numerator: 1,
              quantity_denominator: 4,
              preparation: undefined,
              optional: false,
              unit: 'tsp'
            },
            {
              name: 'nutritional yeast OR any flour (try oat flour)',
              quantity_numerator: 1,
              quantity_denominator: 3,
              preparation: undefined,
              optional: false,
              unit: 'c'
            },
            {
              name: '- 1 cup finely chopped greens (kale',
              quantity_numerator: 1,
              quantity_denominator: 2,
              preparation: 'spinach, parsley)',
              optional: false,
              unit: undefined
            },
            {
              name: 'toppings: avocado',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: 'tomato, vegenaise, burger buns, greens',
              optional: false,
              unit: undefined
            },
            {
              name: 'skillet: 1 Tbsp oil ( extra virgin olive oil',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: 'coconut oil, or other)',
              optional: false,
              unit: undefined
            },
            {
              name: 'optional: Panko bread crumbs for crispy coating',
              quantity_numerator: 1,
              quantity_denominator: 1,
              preparation: undefined,
              optional: true,
              unit: undefined
            }
          ]
        }
      ])
    })

    test('procedure_lists', async () => {
      const { procedure_lists } = await importer(source)
      expect(procedure_lists).toEqual([
        {
          lines: [
            {
              text:
                'Bake your sweet potato in a 400 degree oven for 40-60 minutes or until tender. If in a hurry, you could use the microwave, but oven-baked yields a bit more flavor.'
            },
            {
              text:
                'Add the potato and beans to a large mixing bowl. Using a large fork, mash well. Fold in the onion and keep mashing. Add all the remaining burger ingredients and mash, mash, mash well until thickened and mashed well. Tip! Rinse your beans in hot water before adding to bowl, this heats them, making them easier to mash.'
            },
            { text: 'Warm oven to 400 degrees.' },
            { text: 'Warm a skillet over high heat and add the oil.' },
            {
              text:
                'Using hands, form the burger mixture into large patties.  Place patties in the hot skillet. Note: If using Panko bread crumbs, before placing burgers in skillet, roll patties in Panko to coat well. In skillet: Cook 1-3 minutes on each side, until lightly browned. Repeat until all the burger mixture has been used. Optional: Before forming patties, place mixture in the fridge for a half hour or longer.'
            },
            {
              text:
                'Place the skillet-cooked patties on a baking sheet and bake for 10-15 minutes, until cooked through. Note: YES you could skip the skillet part and just bake the veggie burgers, but the flavor is better with those crispy oil-seared edges. If just baking, the baking time will be around 20 minutes, depending on patty size.'
            },
            {
              text:
                'Slice up all your burger toppings and toast the buns. Sprouted grain were used! Add vegan mayo or spicy mustard and the patty and toppings. Serve warm!'
            },
            {
              text:
                'Store leftover burgers, sealed, in the fridge for up to a day, or freeze and consume within a few weeks for best flavor and texture. To reheat: warm in a 400 degree oven until warmed through, about 12 minutes, depending on burger thickness.'
            },
            {
              text:
                'Bake your sweet potato in a 400 degree oven for 40-60 minutes or until tender. If in a hurry, you could use the microwave, but oven-baked yields a bit more flavor.'
            },
            {
              text:
                'Add the potato and beans to a large mixing bowl. Using a large fork, mash well. Fold in the onion and keep mashing. Add all the remaining burger ingredients and mash, mash, mash well until thickened and mashed well. Tip! Rinse your beans in hot water before adding to bowl, this heats them, making them easier to mash.'
            },
            { text: 'Warm oven to 400 degrees.' },
            { text: 'Warm a skillet over high heat and add the oil.' },
            {
              text:
                'Using hands, form the burger mixture into large patties.  Place patties in the hot skillet. Note: If using Panko bread crumbs, before placing burgers in skillet, roll patties in Panko to coat well. In skillet: Cook 1-3 minutes on each side, until lightly browned. Repeat until all the burger mixture has been used. Optional: Before forming patties, place mixture in the fridge for a half hour or longer.'
            },
            {
              text:
                'Place the skillet-cooked patties on a baking sheet and bake for 10-15 minutes, until cooked through. Note: YES you could skip the skillet part and just bake the veggie burgers, but the flavor is better with those crispy oil-seared edges. If just baking, the baking time will be around 20 minutes, depending on patty size.'
            },
            {
              text:
                'Slice up all your burger toppings and toast the buns. Sprouted grain were used! Add vegan mayo or spicy mustard and the patty and toppings. Serve warm!'
            },
            {
              text:
                'Store leftover burgers, sealed, in the fridge for up to a day, or freeze and consume within a few weeks for best flavor and texture. To reheat: warm in a 400 degree oven until warmed through, about 12 minutes, depending on burger thickness.'
            }
          ]
        }
      ])
    })
  })
})
