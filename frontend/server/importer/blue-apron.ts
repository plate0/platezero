import { Importer } from './importer'
import { toNumber } from 'lodash'
import { Preheat, IngredientListJSON, ProcedureListJSON } from '../../models'
import * as cheerio from 'cheerio'
import { fraction, unitfy } from '../../common'

export class BlueApronImporter extends Importer {
  private $: any
  private url: string

  public async setup(raw: any) {
    this.$ = cheerio.load(raw)
  }

  public async getTitle() {
    const { $ } = this
    return $('.ba-recipe-title h1')
      .text()
      .trim()
  }

  public async getSubtitle() {
    const { $ } = this
    return $('.ba-recipe-title h2')
      .text()
      .trim()
  }

  public async getSourceUrl() {
    return this.url
  }

  public async getYield() {
    const { $ } = this
    return toNumber($('[itemprop="recipeYield"]').text())
  }

  public async getPreheats(): Promise<Preheat[]> {
    const { $ } = this
    const regex = /preheat to (\d+).([FC])/gm
    const str = $('.section-recipe.recipe-instructions').text()
    const preheats = []
    let m
    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++
      }
      preheats.push({
        name: 'oven',
        temperature: m[1],
        unit: m[2]
      })
    }
    return preheats
  }

  public async getIngredientLists(): Promise<IngredientListJSON[]> {
    const { $ } = this
    return [
      {
        name: 'Ingredients',
        // image
        ingredients: $('.section-recipe.recipe-ingredients ul li')
          .map(function() {
            const amount = $(this)
              .find('span')
              .first()
              .text()
              .trim()
            const name = $(this)
              .text()
              .trim()
              .replace(new RegExp(`^${amount}`), '')
              .trim()
            const [quantity, unit] = amount.replace(/\n/gm, ' ').split(' ')
            const f = fraction(quantity)
            return {
              name,
              quantity_numerator: f.n,
              quantity_denominator: f.d,
              preparation: undefined,
              optional: false,
              unit: unitfy(unit)
            }
          })
          .get()
      }
    ]
  }

  public async getProcedureLists(): Promise<ProcedureListJSON[]> {
    const { $ } = this
    return [
      {
        name: 'Instructions',
        steps: $('.section-recipe.recipe-instructions .step.row .col-md-6')
          .map(function() {
            return {
              image: $(this)
                .find('img')
                .first()
                .prop('src'),
              title: $(this)
                .find('.step-title')
                .first()
                .text()
                .trim(),
              text: $(this)
                .find('.step-txt')
                .first()
                .text()
                .trim()
            }
          })
          .get()
      }
    ]
  }

  // getTime

  // getYield

  // getNutrition

  // getImageUrl
  // getSourceUrl
  // getIngredientLists
  // getProcedureLists

  // thoughts: ensure HTML/markdown stays with bolddness.
  //
  // get step names
  //
  // get step images
}
