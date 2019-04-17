import React from 'react'
import { Row, Col, Badge } from 'reactstrap'
import * as ReactMarkdown from 'react-markdown'

import { ProcedureListJSON } from '../models'

export const ProcedureLists = ({ lists }: { lists: ProcedureListJSON[] }) => (
  <>
    {lists.map((list, key) => (
      <ProcedureList key={key} list={list} />
    ))}
  </>
)

const ProcedureList = ({ list }: { list: ProcedureListJSON }) => (
  <div className="mb-3">
    {list.name && <p className="font-weight-bold border-bottom">{list.name}</p>}
    {list.lines.map((l, key) => (
      <div
        key={key}
        itemProp="recipeInstructions"
        itemScope={true}
        itemType="http://schema.org/HowToStep"
      >
        {l.title && (
          <div className="mb-3">
            <h4 className="border-bottom pb-2">
              <Badge color="primary" pill className="mr-2" itemProp="position">
                {key + 1}
              </Badge>
              <span itemProp="headline">{l.title}</span>
            </h4>
          </div>
        )}
        <Row>
          {l.image_url && (
            <Col xs="12" lg="4">
              <img
                className="w-100 mb-3"
                src={l.image_url}
                itemProp="exampleOfWork"
              />
            </Col>
          )}
          <Col itemProp="text">
            <ReactMarkdown source={l.text} />
          </Col>
        </Row>
      </div>
    ))}
  </div>
)
