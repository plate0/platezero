import React from 'react'
import ReactDOM from 'react-dom'
import { Row, Col, Badge } from 'reactstrap'

import { ProcedureListJSON } from '../models'
import { Markdown } from './Markdown'

export const ProcedureLists = ({ lists }: { lists: ProcedureListJSON[] }) => (
  <>
    {lists.map((list, index) => (
      <ProcedureList index={index} list={list} />
    ))}
  </>
)

const ProcedureList = ({ list }: { list: ProcedureListJSON }) => (
  <div className="mb-3">
    {list.name && <p className="font-weight-bold border-bottom">{list.name}</p>}
    {list.lines.map((l, key) => (
      <Row
        key={key}
        itemProp="recipeInstructions"
        itemScope={true}
        itemType="http://schema.org/HowToStep"
      >
        {l.image_url && (
          <Col xs="12">
            <img
              className="w-100 mb-3 p-0 d-print-none"
              src={l.image_url}
              itemProp="exampleOfWork"
            />
          </Col>
        )}
        <Col xs="1">
          <ItemNo value={key + 1} />
        </Col>
        <Col xs="11" itemProp="text">
          {l.title && (
            <h5>
              <span itemProp="headline">{l.title}</span>
            </h5>
          )}
          <Markdown source={l.text} />
        </Col>
      </Row>
    ))}
  </div>
)

const ItemNo = ({value}: {value: number}) => (
        <Badge
        color="primary"
        pill
        className="mr-2"
        itemProp="position"
      >
        {value}
      </Badge>
)
