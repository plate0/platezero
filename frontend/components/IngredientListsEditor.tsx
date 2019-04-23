import React from 'react'
import * as _ from 'lodash'
import Fraction from 'fraction.js'

import { IngredientListJSON, IngredientLineJSON } from '../models'
import { IngredientLists } from './IngredientLists'
import { unitfy } from '../common/unit'
import { changesBetween } from '../common/changes'
import { LivePreviewEditor } from './LivePreviewEditor'
import { Blankslate } from './Blankslate'

const OPTIONAL = '(optional)'

interface Props {
  lists: IngredientListJSON[]
  onChange?: (lists: IngredientListJSON[]) => any
}

export function IngredientListsEditor(props: Props) {
  return (
    <LivePreviewEditor
      initialData={props.lists}
      dataToText={ingredientListsToText}
      textToData={parseIngredientLists}
      placeholder={`1 clove of garlic; minced\n1 1/2 c water\nmayonaise (optional)\nsalt and pepper to taste`}
      preview={lists => <IngredientLists lists={lists} highlight={true} />}
      onChange={props.onChange}
      differ={changesBetween}
      minHeight="7rem"
      blankslate={
        <Blankslate className="h-100 w-100">
          <p>
            <strong>Ingredients Preview</strong>
          </p>
          <div className="small">
            As you enter your ingredients, a live preview will appear so you can
            see what they will look like.
          </div>
        </Blankslate>
      }
      hasPreview={lists =>
        Boolean(lists && lists.length && lists[0].lines.length)
      }
      formattingTips={
        <ul className="small">
          <li>Write your ingredients, one on each line, in the box above.</li>
          <li>
            The recognized format is <code>[quantity]</code>,{' '}
            <code>[unit]</code>, <code>[ingredient]</code>.
          </li>
          <li>
            To specify a note or preparation for an ingredient, such as “diced,”
            separate it from the ingredient name with <code>;</code>. For
            example: <code>1 clove of garlic; minced</code>
          </li>
          <li>
            To mark an ingredient as Optional, write <code>(optional)</code> at
            the end of the line.
          </li>
          <li>
            Separate your ingredients into different sections by leaving a blank
            line in between them.
          </li>
          <li>
            Give your sections titles by beginning a line with a <code>#</code>,
            such as <code># For the sauce:</code>.
          </li>
        </ul>
      }
    />
  )
}

function ingredientListsToText(lists: IngredientListJSON[]): string {
  return _.join(_.map(lists, ingredientListToText), '\n\n')
}

function ingredientListToText(list: IngredientListJSON): string {
  let text = ''
  if (list.name) {
    text += `# ${list.name}\n\n`
  }
  text += _.join(_.map(list.lines, ingredientLineToText), '\n')
  return text
}

function amount({
  quantity_numerator,
  quantity_denominator
}): string | undefined {
  if (!quantity_numerator || !quantity_denominator) {
    return undefined
  }
  try {
    const amt = new Fraction(quantity_numerator, quantity_denominator)
    return amt.toFraction(true)
  } catch {}
  return undefined
}

function ingredientLineToText(line: IngredientLineJSON): string {
  return _.join(
    _.reject(
      [
        amount(line),
        line.unit,
        `${line.name}${line.preparation ? '; ' + line.preparation : ''}`,
        line.optional ? OPTIONAL : undefined
      ],
      _.isUndefined
    ),
    ' '
  )
}

function parseIngredientLists(text: string): IngredientListJSON[] {
  const lines = _.split(text, '\n')
  return _.reduce(
    lines,
    (acc, line) => {
      if (_.size(acc) === 0) {
        acc.push({ name: undefined, lines: [] })
      }
      const section = _.last(acc)
      if (_.startsWith(line, '# ')) {
        // it's a name
        section.name = line.substring(2)
      } else if (_.trim(line) === '' && _.size(section.lines) > 0) {
        // it's a blank line and we've already filled lines in this section, we
        // should start a new section
        acc.push({ name: undefined, lines: [] })
      } else if (_.trim(line) !== '') {
        // it's a non-blank, non-header line: parse it as an ingredient!
        section.lines.push(parseIngredientLine(line))
      }
      return acc
    },
    []
  )
}

function parseIngredientLine(text: string): IngredientLineJSON {
  const [quantity_numerator, quantity_denominator, rest1] = parseAmount(text)
  const [unit, rest2] = parseUnit(rest1)
  const [name, rest3] = parseName(rest2)
  const [preparation, rest4] = parsePreparation(rest3)
  const optional = parseOptional(rest4)
  return {
    quantity_numerator,
    quantity_denominator,
    unit,
    name,
    preparation,
    optional
  }
}

function parseAmount(text: string): [number, number, string] {
  try {
    // first try to match a decimal
    const decResults = text.match(/^(\d*\.\d+?)/)
    if (decResults) {
      const f = new Fraction(decResults[0])
      const rest = text.substring(_.size(decResults[0]))
      return [f.n, f.d, rest]
    }
    // next, if no decimal was found, try to match a whole number or whole
    // number + fraction
    const results = text.match(/^((\d+\s+)?\d+(\/\d+)?)/)
    if (results) {
      const f = new Fraction(results[0])
      const rest = text.substring(_.size(results[0]))
      return [f.n, f.d, rest]
    }
  } catch {}
  return [undefined, undefined, text]
}

function parseUnit(text: string): [string, string] {
  const words = _.split(_.trim(text), /\s+/)
  const maybeUnit = unitfy(_.head(words))
  if (maybeUnit) {
    return [maybeUnit, _.join(_.tail(words), ' ')]
  }
  return [undefined, text]
}

function parseName(text: string): [string, string] {
  const [name, ...rest] = _.split(text, ';')
  if (_.endsWith(name, OPTIONAL)) {
    return [
      _.trim(_.replace(name, OPTIONAL, '')),
      _.trim(_.join(rest, ' ') + OPTIONAL)
    ]
  }
  return [_.trim(name), _.trim(_.join(rest, ' '))]
}

function parsePreparation(text: string): [string, string] {
  if (_.endsWith(text, OPTIONAL)) {
    return [_.trim(_.replace(text, OPTIONAL, '')), OPTIONAL]
  }
  return [_.trim(text), undefined]
}

function parseOptional(text: string): boolean {
  return _.endsWith(_.trim(text), OPTIONAL)
}
