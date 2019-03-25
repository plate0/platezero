import { Importer } from './importer'
import { last } from 'lodash'
import * as moment from 'moment'
import { Preheat, IngredientListJSON, ProcedureListJSON } from '../../models'
import * as cheerio from 'cheerio'
import { PostRecipe } from '../../common/request-models'
import { parse } from '../../common/ingredient'
const TurndownService = require('turndown')

const title = ($: any) =>
  $('h1.title.recipe-title')
    .text()
    .trim()

const description = ($: any) =>
  $('.recipe-introduction-body p:not(.caption)')
    .first()
    .text()
    .trim()

const image_url = ($: any) =>
  $('.recipe-main-photo .se-pinit-image-container img').attr('src')

const getYield = ($: any) =>
  $('.recipe-about .info.yield')
    .text()
    .trim()

const duration = ($: any) => {
  // parse format: 1 hour
  const dur = $('.recipe-about li:nth-child(3) .info')
    .text()
    .replace(/about/i, '')
    .trim()
  // This parses the number part quite well, actually
  const num = parseInt(dur)
  const unit: any = last(dur.split(/\s/))
  return moment.duration(num, unit).asSeconds()
}

const preheats = ($: any): Preheat[] => {
  const regex = /preheat (.*) to (\d+).([FC])/gm
  const str = $('.recipe-procedure').text()
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
      unit: m[3]
    })
  }
  return preheats
}

const ingredient_lists = ($: any): IngredientListJSON[] => {
  const lists: IngredientListJSON[] = []
  let list: IngredientListJSON = undefined
  $('.recipe-ingredients ul li').each(function() {
    const el = $(this)
    if (el.find('strong').length > 0) {
      if (list) {
        lists.push(list)
      }
      list = {
        name: el.text(),
        lines: []
      }
    } else {
      if (!list) {
        // Default list
        list = {
          name: el.text(),
          lines: []
        }
      }
      list.lines.push(parse(el.text()))
    }
  })
  lists.push(list)
  return lists
}

const procedure_lists = ($: any): ProcedureListJSON[] => {
  const turndown = new TurndownService()
  return [
    {
      lines: $('.recipe-procedures ol li .recipe-procedure-text')
        .map(function() {
          return {
            text: turndown.turndown($(this).html())
          }
        })
        .get()
    }
  ]
}

export const SeriousEatsImporter: Importer = async (
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
