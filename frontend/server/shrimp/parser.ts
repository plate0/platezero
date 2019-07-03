import * as moment from 'moment'
import { Section } from './common'
import {
  PreheatJSON,
  IngredientListJSON,
  ProcedureListJSON
} from '../../models'

import { parseIngredient } from 'ingredient-parser'
import { PostRecipe } from '../../common/request-models'

/**
 * Each lexicon defines the keywords or phrases used to locate a particular block of text.
 * Before use, a lexicon is sorted by descending length of entry.
 */
const cookTimeLexicon = ['cook time', 'cooking time', 'cooking', 'cook']
const ingredientsLexicon = ['ingredients']
const methodLexicon = ['method', 'preparation', 'directions', '1.']
const preheatLexicon = ['preheat']
const prepTimeLexicon = ['prep time', 'preparation time', 'preparation', 'prep']
const totalTimeLexicon = ['total time']
const yieldLexicon = ['yield', 'serves', 'servings']

/**
 * Indicates the boundaries of a block of text
 */
class Cursor {
  start: number
  end: number
  constructor(start, end) {
    this.start = start
    this.end = end
  }
  advance(end) {
    this.start = this.end
    this.end = end ? end : this.end
  }
}

/**
 * Arbitrarily named utility class
 */
class Wombat {
  lex: string
  cursor: Cursor
  lexicon: string[]
  constructor(lexicon, cursor, lex) {
    this.lexicon = lexicon
    this.cursor = cursor
    this.lex = lex
  }
}

/**
 * A collection of wombats.
 * Really.
 * https://en.wikipedia.org/wiki/List_of_English_terms_of_venery,_by_animal#W
 */
class Wisdom {
  wombats: Wombat[]
  gaps: Cursor[]
  lines: string[]
  map: Map<string, Wombat>
  /**
   * @param {String[]} lines the text to be analysed, as an array of strings
   */
  constructor(lines) {
    this.map = new Map()
    this.lines = lines
    this.wombats = []
    this.gaps = []
  }

  /**
   * Add a new wombat
   * @param {String} name the name of this wombat
   * @param {String[]} lexicon the wombat's lexicon
   */
  add(name, lexicon) {
    let wombat = this._locate(lexicon)
    if (wombat) {
      this.map.set(name, wombat)
    }
    return this
  }

  /**
   * Return the named wombat
   * @param {String} name
   */
  get(name) {
    return this.map.get(name)
  }

  /**
   * Sort the collection of wombats by cursor start position
   * and fix up each cursor end position to be the lowest of:
   *    1. the next cursor start position
   *    2. the next 'end of section' marker
   *    3. the end of the text
   *
   * This method <em>must</em> be called after <em>all</em> wombats have been added
   */
  sort() {
    // Sort the map entries by 'cursor.start' value
    let entries = Array.from(this.map.entries())
    entries.sort((e1, e2) => {
      return e1[1].cursor.start - e2[1].cursor.start
    })

    // Complete the 'cursor.end' values
    for (let i = 0; i < entries.length; ++i) {
      let e1 = entries[i]
      let next
      if (i + 1 < entries.length) {
        let e2 = entries[i + 1]
        next = e2[1].cursor.start
      } else {
        next = this.lines.length
      }
      let eos = this.endOfSection(e1[1].cursor.start)
      e1[1].cursor.end = eos && eos < next ? eos : next
    }

    // Create a new map in the new sort order
    let map = new Map()
    entries.forEach(e => map.set(e[0], e[1]))
    this.map = map

    this.wombats = Array.from(this.map.values())

    this.mindTheGaps()
  }

  /**
   * Try to locate gaps between the sections
   * e.g.
   * Ingredients
   *   eye of toad
   *   wing of bat
   * <section marker>
   * This text has no wombat:
   *   it's a gap!>
   * Procedure
   *   hubble
   *   bubble
   *
   */
  mindTheGaps() {
    for (let i = 0; i < this.wombats.length; ++i) {
      const next =
        i < this.wombats.length - 1
          ? this.wombats[i + 1].cursor.start
          : this.lines.length
      this.gaps.push(new Cursor(this.wombats[i].cursor.end, next))
    }
  }

  /**
   * Look for a section marker that
   *   1. is not the start line
   *   2. follows at least one line that is not a section marker
   *
   * @param start the index of the start line
   * @return the index of the section marker, or undefined
   */
  endOfSection(start: number): number {
    let i = start + 1
    while (i < this.lines.length && this.lines[i] == Section) {
      ++i
    }
    while (i < this.lines.length && this.lines[i] != Section) {
      ++i
    }
    return i < this.lines.length ? i : undefined
  }

  /**
   * Prepare line for comparison
   * @param {String} line
   */
  _normalise(line) {
    return line
      .trim()
      .toLowerCase()
      .replace(/[^\sa-z0-9\.]/, '')
  }

  /**
   * Sort the lexicon entries by decreasing length
   * @param {String[]} lexicon
   */
  _sort(lexicon) {
    lexicon.sort((e1, e2) => {
      return e2.length - e1.length
    })
  }

  /**
   * Use the given lexicon to locate the start of a block of text
   * @param {String[]} lexicon
   */
  _locate(lexicon) {
    this._sort(lexicon)
    let start, lx
    // Try for an exact match
    for (let i = 0; i < this.lines.length && !lx; ++i) {
      let text = this._normalise(this.lines[i])
      if (text.length > 0) {
        for (let lex of lexicon) {
          if (text == lex) {
            start = i
            lx = lex
            break
          }
        }
      }
    }
    if (!lx) {
      // Try for prefix
      for (let i = 0; i < this.lines.length && !lx; ++i) {
        let text = this._normalise(this.lines[i])
        if (text.length > 0) {
          for (let lex of lexicon) {
            if (text.startsWith(lex)) {
              start = i
              lx = lex
              break
            }
          }
        }
      }
    }
    let wombat
    if (lx) {
      let cursor = new Cursor(start, 0)
      wombat = new Wombat(lexicon, cursor, lx)
    }
    return wombat
  }
}

/**
 * Parse a recipe from the given lines of text
 * @param {String[]} lines
 */
function parse(lines: string[]): PostRecipe {
  // The result object
  const r = <PostRecipe>{}

  // locate the various text blocks
  let w = new Wisdom(lines)
  w.add('cookTime', cookTimeLexicon)
    .add('ingredients', ingredientsLexicon)
    .add('steps', methodLexicon)
    .add('preheat', preheatLexicon)
    .add('prepTime', prepTimeLexicon)
    .add('totalTime', totalTimeLexicon)
    .add('yield', yieldLexicon)
    .sort()

  // populate the result
  let cursor = new Cursor(0, 0)
  let o = getTitle(lines, cursor)
  if (o) {
    r.title = o['text']
    cursor = o['cursor']
  }
  cursor.advance(w.wombats[0].cursor.start)
  r.description = getDescription(lines, cursor)

  r.ingredient_lists = getIngredients(w)
  r.procedure_lists = getMethods(w)

  r.yield = getYield(w)
  r.duration = getTotalTime(w)
  r.preheats = getPreheat(w)

  return r
}

function getTitle(lines, cursor) {
  for (let i = cursor.start; i < lines.length; ++i) {
    let text = lines[i].trim()
    if (text.length > 0 && text != Section) {
      cursor.end = i + 1
      return { text, cursor }
    }
  }
}

function getDescription(lines: string[], cursor: Cursor): string {
  let out = []
  for (let i = cursor.start; i < cursor.end; ++i) {
    if (lines[i] != Section) {
      out.push(lines[i])
    }
  }
  return out.length === 0 ? undefined : out.join(' ')
}

function getIngredients(w: Wisdom): IngredientListJSON[] {
  const list = <IngredientListJSON>{ lines: [] }
  let raw = getText(w, 'ingredients')
  if (!raw) {
    const cursor = w.gaps.shift()
    raw = getByCursor(w, cursor)
  }
  if (raw) {
    raw.forEach(line => {
      if (line != Section) {
        list.lines.push(parseIngredient(line))
      }
    })
  }
  return [list]
}

function getMethods(w: Wisdom): ProcedureListJSON[] {
  const list = <ProcedureListJSON>{ lines: [] }
  let text = getText(w, 'steps')
  if (!text) {
    const cursor = w.gaps.shift()
    text = getByCursor(w, cursor)
  }
  if (text) {
    const raw = denumerate(text)
    raw.forEach(line => {
      if (line != Section) {
        list.lines.push({ text: line })
      }
    })
  }
  return [list]
}

function getByCursor(w: Wisdom, cursor: Cursor): string[] {
  let out
  if (cursor) {
    out = []
    for (let i = cursor.start; i < cursor.end; ++i) {
      let text = w.lines[i]
      if (text.trim().length > 0) {
        out.push(text)
      }
    }
  }
  return out
}

function getTotalTime(w: Wisdom): number {
  let t = getDuration(w, 'totalTime')
  if (!t) {
    let p = getDuration(w, 'prepTime')
    let c = getDuration(w, 'cookTime')
    t = p + c
  }
  return t
}

function getDuration(w: Wisdom, tag: string): number {
  const rxHours = /(\d+)\s*h\w+/i
  const rxMinutes = /(\d+)\s*m\w+/i
  let h = 0,
    m = 0
  const lines = getText(w, tag)
  if (lines) {
    const text = lines.join(' ')
    let a = rxHours.exec(text)
    if (a) {
      h = parseInt(a[1], 10)
      h = isNaN(h) ? 0 : h
    }
    a = rxMinutes.exec(text)
    if (a) {
      m = parseInt(a[1], 10)
      m = isNaN(m) ? 0 : m
    }
  }
  return moment.duration({ hours: h, minutes: m }).asSeconds()
}

function getPreheat(w: Wisdom): PreheatJSON[] {
  let r = new Array<PreheatJSON>()
  const rx = /(\D+)\s*(\d+)\s*\u00b0*([CF]\b)/
  const lines = getText(w, 'preheat')
  if (lines) {
    const text = lines.join(' ')
    let a
    while ((a = rx.exec(text)) != null) {
      let p = <PreheatJSON>{ name: a[1], temperature: Number(a[2]), unit: a[3] }
      r.push(p)
    }
  }
  return r
}

function getYield(w: Wisdom): string {
  const lines = getText(w, 'yield')
  if (lines) {
    for (let i = 0; i < lines.length; ++i) {
      let line = lines[i]
      if (/^\s*\d+\s*$/.test(line)) {
        return `Serves ${line}`
      } else {
        let a = /\d+/.exec(line)
        if (a) {
          return line
        }
      }
    }
  }
  return undefined
}

function getText(w: Wisdom, tag: string): string[] {
  let wombat = w.get(tag)
  if (wombat) {
    let out = []
    let cursor = wombat.cursor
    let i = cursor.start
    // Attempt to skip the heading text (lex)
    let text = w.lines[i]
      .trim()
      .toLowerCase()
      .replace(/[^\s\w]/, '')
    if (wombat.lex == text) {
      ++i
    } else if (text.startsWith(wombat.lex)) {
      text = w.lines[i].substring(wombat.lex.length)
      out.push(text)
      ++i
    }
    // capture the rest of the text
    for (; i < cursor.end; ++i) {
      let text = w.lines[i]
      if (text.trim().length > 0 && text != Section) {
        out.push(text)
      }
    }
    return out
  }
}

function denumerate(lines) {
  if (lines) {
    let out = new Array()
    lines.forEach(line => {
      out.push(line.replace(/^\s*\d+[\.\):]*\s/, ''))
    })
    return out
  }
}

module.exports = { parse }
