import { Importer } from './importer'
import * as moment from 'moment'
import { Preheat, IngredientListJSON, ProcedureListJSON } from '../../models'
import * as cheerio from 'cheerio'
import { PostRecipe } from '../../common/request-models'
import { parse } from '../../common/ingredient'
const TurndownService = require('turndown')

const title = ($: any) =>
  $('.recipe-title.title.name')
    .attr('data-name')
    .trim()

const description = ($: any) =>
  $('div[itemprop="description"]')
    .find('p')
    .first()
    .text()
    .trim()

const image_url = ($: any) =>
  $('.recipe-intro .media-container img').attr('src')

const getYield = ($: any) =>
  $('ul.recipe-time-yield li')
    .first()
    .find('span')
    .last()
    .text()
    .trim()

const duration = ($: any) =>
  moment.duration($('meta[itemprop="cookTime"]').attr('content')).asSeconds()

const preheats = ($: any): Preheat[] => {
  const regex = /preheat (.*) to (\d+)/gim
  const str = $('.recipe-steps').text()
  const preheats = []
  let m
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    preheats.push({
      name: m[1],
      temperature: parseInt(m[2]),
      unit: 'F'
    })
  }
  return preheats
}

const ingredient_lists = ($: any): IngredientListJSON[] => [
  {
    name: 'Ingredients',
    lines: $('ul.recipe-ingredients li')
      .map(function() {
        return parse(
          $(this)
            .text()
            .replace(/\s\s+/g, ' ')
            .trim()
        )
      })
      .get()
  }
]

const procedure_lists = ($: any): ProcedureListJSON[] => {
  const turndown = new TurndownService()
  return [
    {
      lines: $('ol.recipe-steps li')
        .map(function() {
          return {
            text: turndown.turndown($(this).html())
          }
        })
        .get()
    }
  ]
}

export const NYTCookingImporter: Importer = async (
  source: any
): Promise<PostRecipe> => {
  const $ = cheerio.load(source)
  return {
    title: title($),
    description: description($),
    image_url: image_url($),
    source_url: source as string, //TODO: FIX
    yield: getYield($),
    duration: duration($),
    preheats: preheats($),
    ingredient_lists: ingredient_lists($),
    procedure_lists: procedure_lists($)
  }
}
