import React, { useState, useEffect, useRef } from 'react'
import { Button, Row, Col } from 'reactstrap'
import * as _ from 'lodash'

import { PreheatJSON } from '../models'
import { ActionLine } from './ActionLine'
import { PlainInput } from './PlainInput'
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
      <>
        <div className="bg-light rounded pt-3 py-3 mb-3 text-secondary text-center">
          <p>
            <small>
              Specifying your preheats here lets you immediately see them at the
              top of your recipes. Never forget to turn on the oven again!
            </small>
          </p>
          {addBtn}
        </div>
      </>
    )
  }

  return (
    <>
      <ActionLine icon="fal fa-times invisible" onAction={_.noop}>
        <Row>
          <Col xs="12" sm="6" md="4" lg="3">
            <strong>Device</strong>
          </Col>
          <Col>
            <strong>Temperature</strong>
          </Col>
        </Row>
      </ActionLine>
      {preheats.map(preheat => (
        <ActionLine
          key={preheat.id}
          icon={`fal fa-${preheat.removed ? 'undo' : 'times'}`}
          onAction={act(preheat)}
        >
          {preheat.removed ? (
            <RemovedPreheat preheat={preheat.json} />
          ) : (
            <Preheat
              preheat={preheat.json}
              onChange={json =>
                setPreheats(replaceItem(preheats, preheat.id, json))
              }
            />
          )}
        </ActionLine>
      ))}
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
  onChange
}: {
  preheat: PreheatJSON
  onChange: (preheat: PreheatJSON) => void
}) {
  const orig = useRef(preheat)
  const [name, setName] = useState(preheat.name || '')
  const [temp, setTemp] = useState(temperatureString(preheat))
  useEffect(() => {
    if (_.isFunction(onChange)) {
      const old = _.omit(orig.current, 'id')
      const curr = normalize({ name, ...parseTemperature(temp) })
      const changed = !_.isEqual(old, curr)
      const id = changed ? undefined : orig.current.id
      onChange({ id, ...curr })
    }
  }, [name, temp])
  return (
    <Row className="mb-3" noGutters>
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
