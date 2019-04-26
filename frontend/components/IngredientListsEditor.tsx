import React from 'react'
import * as _ from 'lodash'
import Fraction from 'fraction.js'

import { IngredientListJSON, IngredientLineJSON } from '../models'
import { IngredientLists } from './IngredientLists'
import { parseIngredient } from 'ingredient-parser'
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
      placeholder={`1 clove of garlic -- minced\n1 1/2 c water\nmayonaise (optional)\nsalt and pepper to taste`}
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
            separate it from the ingredient name with <code>--</code>. For
            example: <code>1 clove of garlic -- minced</code>
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
}: IngredientLineJSON): string | undefined {
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
        line.name,
        line.preparation ? `-- ${line.preparation}` : undefined,
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
        section.lines.push(parseIngredient(line))
      }
      return acc
    },
    []
  )
}
