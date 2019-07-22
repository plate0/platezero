import React from 'react'
import * as _ from 'lodash'
import { PreheatJSON } from '../models'
import { Preheats } from './Preheats'
import { Blankslate } from './Blankslate'
import { LivePreviewEditor } from './LivePreviewEditor'
import { normalize } from '../common/model-helpers'

interface Props {
  preheats: PreheatJSON[]
  onChange?: (preheats: PreheatJSON[]) => any
}

export function PreheatsEditor(props: Props) {
  return (
    <LivePreviewEditor
      initialData={props.preheats}
      dataToText={preheatsToText}
      textToData={parsePreheats}
      preview={ph => <Preheats preheats={ph} />}
      onChange={props.onChange}
      placeholder={`Oven: 350 F\nSous Vide: 170 F`}
      differ={differ}
      blankslate={
        <Blankslate className="w-100 h-100">
          <p>
            <strong>Preheats</strong>
          </p>
          <div className="small">
            Display preheats prominently on your recipes. Never forget to turn
            on the oven again!
          </div>
        </Blankslate>
      }
      hasPreview={ph => Boolean(ph && ph.length)}
      formattingTips={
        <ul className="small">
          <li>Write one preheat on each line</li>
          <li>
            Use the format <strong>appliance: temperature</strong>.
          </li>
        </ul>
      }
    />
  )
}

function preheatsToText(preheats: PreheatJSON[]): string {
  return _.join(
    _.map(
      preheats,
      preheat => `${preheat.name}: ${preheat.temperature} ${preheat.unit}`
    ),
    '\n'
  )
}

function parsePreheats(text: string): PreheatJSON[] {
  return _.reject(_.map(_.split(text, '\n'), parsePreheat), _.isUndefined)
}

function parsePreheat(line: string): PreheatJSON | undefined {
  const [label, rest] = _.split(line, ':')
  const v = _.size(rest) ? parsePreheatValue(rest) : parsePreheatValue(label)
  const name = _.size(rest) ? label : 'Oven'
  if (!v) {
    return undefined
  }
  const temperature = parseInt(v[0], 10)
  if (_.isNaN(temperature)) {
    return undefined
  }
  const unit = v[1]
  return { name, temperature, unit }
}

function parsePreheatValue(v: string): [string, string] | undefined {
  const [temp, maybeUnit] = _.words(v)
  const unit = tempUnit(maybeUnit)
  if (temp && unit) {
    return [temp, unit]
  }
  if (temp) {
    return [temp, 'F']
  }
  return undefined
}

// take a string and if it's a case insensitive match to 'c' or 'f', return 'C'
// or 'F' respectively, else undefined
function tempUnit(text: string | undefined): 'C' | 'F' | undefined {
  if (!text) {
    return undefined
  }
  const uc = text.toUpperCase()
  return uc === 'C' || uc === 'F' ? uc : undefined
}

function differ(orig: PreheatJSON[], curr: PreheatJSON[]): PreheatJSON[] {
  const usedIds = {}
  return _.map(curr, currPreheat => {
    const origPreheat = _.find(orig, p => {
      if (_.has(usedIds, _.toString(p.id))) {
        return false
      }
      const [a, b] = [p, currPreheat].map(x => normalize(_.omit(x, 'id')))
      return _.isEqual(a, b)
    })
    if (origPreheat) {
      usedIds[_.toString(origPreheat.id)] = true
    }
    return origPreheat || currPreheat
  })
}
