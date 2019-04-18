import React, { useState, useEffect, useRef } from 'react'
import { Button, Row, Col } from 'reactstrap'
import * as _ from 'lodash'

import { PreheatJSON } from '../models'
import { ActionLine } from './ActionLine'
import { PlainInput } from './PlainInput'
import { Blankslate } from './Blankslate'
import { normalize } from '../common/model-helpers'
import {
  jsonToUI,
  uiToJSON,
  generateUITrackable,
  removeItem,
  replaceItem,
  restoreItem
} from '../common/changes'
import { parseTemperature } from '../common/temperature'

const newPreheat = generateUITrackable({
  name: undefined,
  unit: undefined,
  temperature: undefined
})

interface Props {
  preheats: PreheatJSON[]
  onChange?: (preheats: PreheatJSON[]) => void
}
export function Preheats(props: Props) {
  const [preheats, setPreheats] = useState(jsonToUI(props.preheats))

  useEffect(() => {
    if (_.isFunction(props.onChange)) {
      props.onChange(uiToJSON(preheats))
    }
  }, [preheats])

  const act = preheat => () => {
    const f = preheat.removed ? restoreItem : removeItem
    setPreheats(f(preheats, preheat.id))
  }

  const addBtn = (
    <p>
      <Button
        color="secondary"
        size="sm"
        onClick={() => setPreheats([...preheats, newPreheat.next().value])}
      >
        Add Preheat
      </Button>
    </p>
  )

  if (_.size(preheats) === 0) {
    return (
      <Blankslate className="mb-3">
        <p>
          <small>
            Specifying your preheats here lets you immediately see them at the
            top of your recipes. Never forget to turn on the oven again!
          </small>
        </p>
        {addBtn}
      </Blankslate>
    )
  }

  return (
    <>
      {preheats.map(preheat => {
        const icon = preheat.removed ? 'undo' : 'times'
        return (
          <ActionLine
            key={preheat.id}
            icon={`fal fa-${icon}`}
            onAction={act(preheat)}
          >
            {preheat.removed ? (
              <RemovedPreheat preheat={preheat.json} />
            ) : (
              <Preheat
                preheat={preheat.json}
                added={preheat.added}
                onChange={json =>
                  setPreheats(replaceItem(preheats, preheat.id, json))
                }
              />
            )}
          </ActionLine>
        )
      })}
      {addBtn}
    </>
  )
}

const RemovedPreheat = ({ preheat }: { preheat: PreheatJSON }) => (
  <p className="text-muted text-strike">
    {preheat.name} {preheat.temperature}
    {preheat.unit}
  </p>
)

function temperatureString(preheat: PreheatJSON): string {
  const t = preheat.temperature ? '' + preheat.temperature : ''
  const sep = preheat.temperature && preheat.unit ? ' ' : ''
  const unit = preheat.unit || ''
  return t + sep + unit
}

function Preheat({
  preheat,
  added,
  onChange
}: {
  preheat: PreheatJSON
  added: boolean
  onChange: (preheat: PreheatJSON) => void
}) {
  const orig = useRef(preheat)
  const [name, setName] = useState(preheat.name || '')
  const [temp, setTemp] = useState(temperatureString(preheat))

  const old = _.omit(orig.current, 'id')
  const curr = normalize({ name, ...parseTemperature(temp) })
  const changed = !_.isEqual(old, curr)

  const bg = added ? 'bg-added' : changed ? 'bg-changed' : ''

  useEffect(() => {
    if (_.isFunction(onChange)) {
      const id = changed ? undefined : orig.current.id
      onChange({ id, ...curr })
    }
  }, [name, temp])

  return (
    <Row className={`mb-3 ${bg}`} noGutters>
      <Col xs="12" sm="6" md="4" lg="3">
        <PlainInput
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Oven, Sous Vide…"
        />
      </Col>
      <Col>
        <PlainInput
          type="text"
          value={temp}
          onChange={e => setTemp(e.target.value)}
          placeholder="300 F"
        />
      </Col>
    </Row>
  )
}
