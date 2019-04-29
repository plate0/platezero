import React from 'react'
import { Row, Col, Badge } from 'reactstrap'

import { ProcedureListJSON } from '../models'
import { Markdown } from './Markdown'

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
        <Row>
          {l.image_url && (
            <Col xs="12" className="px-0 px-sm-3">
              <img
                className="w-100 mb-3 p-0 d-print-none"
                src={l.image_url}
                itemProp="exampleOfWork"
              />
            </Col>
          )}
          {l.title && (
            <Col xs="12">
              <div className="mb-3">
                <h5 className="border-bottom pb-2 d-flex align-items-center">
                  <Badge
                    color="primary"
                    pill
                    className="mr-2"
                    itemProp="position"
                  >
                    {key + 1}
                  </Badge>
                  <span itemProp="headline">{l.title}</span>
                </h5>
              </div>
            </Col>
          )}
          <Col xs="12" itemProp="text">
            <Markdown source={l.text} />
          </Col>
        </Row>
      </div>
    ))}
  </div>
)
