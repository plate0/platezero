import React from 'react'
import * as _ from 'lodash'
import { Row, Col, CardGroup, Card } from 'reactstrap'
import { IngredientLists } from './IngredientLists'
import { ProcedureLists } from './ProcedureLists'
import { RecipeVersionJSON } from '../models'
import { toHoursAndMinutes } from '../common/time'

const formatDuration = (seconds: number) => {
  const { h, m } = toHoursAndMinutes(seconds)
  const hs = `${h} ${h > 1 ? 'hours' : 'hour'}`
  const ms = `${m} ${m > 1 ? 'minutes' : 'minute'}`
  if (h > 0) {
    return m !== 0 ? `${hs} ${ms}` : hs
  }
  return ms
}

const HeaderBar = ({ version }: { version: RecipeVersionJSON }) => {
  const cards = []

  if (version.recipeYield) {
    cards.push(<span itemProp="recipeYield">{version.recipeYield.text}</span>)
  }

  if (version.recipeDuration) {
    const d = version.recipeDuration.duration_seconds
    cards.push(
      <time itemProp="cookTime" dateTime={`PT${d}S`}>
        {formatDuration(d)}
      </time>
    )
  }

  _.each(version.preheats, preheat => {
    cards.push(
      <span className="text-danger">
        {preheat.name}: {preheat.temperature}º{preheat.unit}
      </span>
    )
  })

  if (!cards.length) {
    return null
  }
  return (
    <CardGroup>
      {cards.map((card, idx) => (
        <Card className="text-center py-1" key={idx}>
          {card}
        </Card>
      ))}
    </CardGroup>
  )
}

export const RecipeVersion = ({ version }: { version: RecipeVersionJSON }) => {
  return (
    <>
      <HeaderBar version={version} />
      <Row className="mt-3">
        <Col xs="12" md="6" lg="4">
          <h2 className="border-bottom">Ingredients</h2>
          <IngredientLists lists={version.ingredientLists} />
        </Col>
        <Col xs="12" md="6" lg="8">
          <h2 className="border-bottom">Instructions</h2>
          <ProcedureLists lists={version.procedureLists} />
        </Col>
      </Row>
    </>
  )
}
