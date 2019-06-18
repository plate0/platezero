import * as moment from 'moment'
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
  array: Wombat[]
  lines: string[]
  map: Map<string, Wombat>
  /**
   * @param {String[]} lines the text to be analysed, as an array of strings
   */
  constructor(lines) {
    this.map = new Map()
    this.lines = lines
    this.array = []
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
   * Sort the collection of wombats by cursor start position.
   * This method <em>must</em> be called after all wombats have been added
   */
  sort() {
    let map = new Map()
    let out = Array.from(this.map.entries())
    out.sort((e1, e2) => {
      return e1[1].cursor.start - e2[1].cursor.start
    })

    for (let i = 0; i < out.length; ++i) {
      let e1 = out[i]
      if (i + 1 < out.length) {
        let e2 = out[i + 1]
        let next = e2[1].cursor.start
        if (next) {
          e1[1].cursor.end = next
        }
      } else {
        e1[1].cursor.end = this.lines.length
      }
    }

    out.forEach(e => map.set(e[0], e[1]))

    this.map = map
    this.array = Array.from(this.map.values())
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
  cursor.advance(w.array[0].cursor.start)
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
    if (text.length > 0) {
      cursor.end = i + 1
      return { text, cursor }
    }
  }
}

function getDescription(lines: string[], cursor: Cursor): string {
  let out = []
  for (let i = cursor.start; i < cursor.end; ++i) {
    out.push(lines[i])
  }
  return out.join(' ')
}

function getIngredients(w: Wisdom): IngredientListJSON[] {
  const raw = getText(w, 'ingredients')
  const list = <IngredientListJSON>{ lines: [] }
  raw.forEach(line => {
    list.lines.push(parseIngredient(line))
  })
  return [list]
}

function getMethods(w: Wisdom): ProcedureListJSON[] {
  const raw = denumerate(getText(w, 'steps'))
  const list = <ProcedureListJSON>{ lines: [] }
  raw.forEach(line => {
    list.lines.push({ text: line })
  })
  return [list]
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

// TODO Untested
function getPreheat(w: Wisdom): PreheatJSON[] {
  let r = new Array<PreheatJSON>()
  const rx = /([\w\s]+\b)\s*(\d+)\s*([CF])/
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

// TODO analyse text, pulls in too much info
function getYield(w: Wisdom): string {
  const lines = getText(w, 'yield')
  if (lines) {
    return lines.join(' ')
  }
  return null
}

// TODO Not working
function getDuration(w: Wisdom, tag: string): number {
  const rxHours = /(\d+)\s*h\w+/i
  const rxMinutes = /(\d+)\s*m\w+/i
  let h, m
  const lines = getText(w, tag)
  if (lines) {
    const text = lines.join(' ')
    let a = rxHours.exec(text)
    if (a) {
      h = a[0][1]
    }
    a = rxMinutes.exec(text)
    if (a) {
      m = a[0][1]
    }
  }
  return moment.duration({ hours: h, minutes: m }).asSeconds()
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
      if (text.trim().length > 0) {
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
