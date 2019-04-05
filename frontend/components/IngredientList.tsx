import React, { useState, useEffect, useRef } from 'react'
import {
  Button,
  Row,
  Col,
  FormGroup,
  FormText,
  Input,
  Label,
  Card,
  CardHeader,
  CardBody
} from 'reactstrap'
import * as _ from 'lodash'

import { IngredientLine } from './IngredientLine'
import { ActionLine } from './ActionLine'
import { IngredientListJSON } from '../models/ingredient_list'
import {
  jsonToUI,
  uiToJSON,
  generateUITrackable,
  hasModifiedItems,
  isChanged,
  removeItem,
  restoreItem,
  replaceItem
} from '../common/changes'

const newIngredient = generateUITrackable({
  quantity_numerator: undefined,
  quantity_denominator: undefined,
  name: '',
  preparation: '',
  optional: false,
  unit: ''
})

interface Props {
  onChange?: (ingredientList: IngredientListJSON) => void
  oneOfMany?: boolean
  ingredientList?: IngredientListJSON
}

export function IngredientList(props: Props) {
  const orig = useRef(props.ingredientList)
  const [name, setName] = useState(props.ingredientList.name)
  const [lines, setLines] = useState(jsonToUI(props.ingredientList.lines))

  useEffect(() => {
    if (_.isFunction(props.onChange)) {
      const changedLines = hasModifiedItems(lines)
      const changedName = name !== orig.current.name
      const id = changedLines || changedName ? undefined : orig.current.id
      props.onChange({ id, name, lines: uiToJSON(lines) })
    }
  }, [name, lines])

  const act = line => () => {
    const f = line.removed ? restoreItem : removeItem
    setLines(f(lines, line.id))
  }

  return (
    <Card className="mb-3">
      <CardHeader>
        <Input
          type="text"
          placeholder="Section Title, e.g. For the filling"
          value={name || ''}
          onChange={e => setName(e.target.value)}
        />
        {!props.oneOfMany && (
          <FormText color="muted">
            Tip: If you just have one section of ingredients, you can leave this
            blank!
          </FormText>
        )}
      </CardHeader>
      <CardBody>
        <ActionLine icon="fal fa-times invisible" onAction={_.noop}>
          <Row className="font-weight-bold" noGutters={true}>
            <Col xs="auto" md="2" className="pl-3">
              Amount
            </Col>
            <Col xs="auto" md="2" className="pl-3">
              Unit
            </Col>
            <Col xs="auto" md={true} className="pl-3">
              Ingredient
            </Col>
            <Col xs="auto" md="3" className="pl-3">
              Preparation
            </Col>
            <Col xs="auto" className="invisible">
              <FormGroup check>
                <Label check>
                  <Input type="checkbox" />
                  <small>Optional</small>
                </Label>
              </FormGroup>
            </Col>
          </Row>
        </ActionLine>
        {lines.map(line => (
          <ActionLine
            icon={`fal fa-${line.removed ? 'undo' : 'times'}`}
            key={line.id}
            onAction={act(line)}
          >
            <IngredientLine
              ingredient={line.json}
              onChange={newLine =>
                setLines(replaceItem(lines, line.id, newLine))
              }
              removed={line.removed}
              added={line.added}
              changed={isChanged(line)}
            />
          </ActionLine>
        ))}
        <div>
          <Button
            color="secondary"
            size="sm"
            onClick={() => setLines([...lines, newIngredient.next().value])}
          >
            Add Ingredient
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}
