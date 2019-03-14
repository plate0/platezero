import { Importer } from './importer'
import * as moment from 'moment'
import {
  RecipeJSON,
  Preheat,
  IngredientListJSON,
  ProcedureListJSON,
  ProcedureLineJSON
} from '../../models'
import * as cheerio from 'cheerio'
import { fraction } from '../../common/fraction'
import { unitfy } from '../../common/unit'
const TurndownService = require('turndown')

export class BlueApronImporter implements Importer {
  private $: any
  private url: string
  private turndown = new TurndownService()

  constructor(url: string) {
    this.url = url
  }

  // @Override
  public async recipe(): Promise<RecipeJSON> {
    return {
      title: await this.getTitle(),
      subtitle: await this.getSubtitle(),
      description: await this.getDescription(),
      image_url: await this.getImageUrl(),
      source_url: await this.getSourceUrl(),
      yield: await this.getYield(),
      duration: await this.getDuration(),
      preheats: await this.getPreheats(),
      ingredient_lists: await this.getIngredientLists(),
      procedure_lists: await this.getProcedureLists()
    }
  }

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

  public async getDescription() {
    const { $ } = this
    return $('[itemprop="description"]')
      .text()
      .trim()
  }

  public async getImageUrl() {
    const { $ } = this
    return $('.ba-hero-image img').prop('src')
  }

  public async getSourceUrl() {
    return this.url
  }

  public async getYield() {
    const { $ } = this
    return $('[itemprop="recipeYield"]').text()
  }

  public async getDuration(): Promise<number> {
    const { $ } = this
    return moment
      .duration($('[itemprop="totalTime"]').attr('content'))
      .asSeconds()
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
        image_url: $('.section-recipe.recipe-ingredients img').attr('src'),
        lines: $('.section-recipe.recipe-ingredients ul li')
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
    const { $, turndown } = this
    return [
      {
        name: 'Instructions',
        lines: $('.section-recipe.recipe-instructions .step.row .col-md-6')
          .map(function(): ProcedureLineJSON {
            return {
              image_url: $(this)
                .find('img')
                .first()
                .prop('src'),
              title: $(this)
                .find('.step-title')
                .first()
                .text()
                .trim(),
              text: turndown
                .turndown(
                  $(this)
                    .find('.step-txt')
                    .first()
                    .html()
                )
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
