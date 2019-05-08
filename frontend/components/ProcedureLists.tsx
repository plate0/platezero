import React from 'react'
import ReactDOM from 'react-dom'
import { Row, Col, Badge } from 'reactstrap'

import { ProcedureListJSON } from '../models'
import { InlineMarkdown } from './InlineMarkdown'

export const ProcedureLists = ({ lists }: { lists: ProcedureListJSON[] }) => (
  <>
    {lists.map((list, index) => (
      <ProcedureList index={index} list={list} />
    ))}
  </>
)

const ProcedureList = ({ list, index }: { list: ProcedureListJSON, index: number }) => (
  <div className="mb-3">
    {list.name && (<p className="font-weight-bold border-bottom"><ItemNo value={index+1}/> {list.name}</p>)}
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
                  <span itemProp="headline">{l.title}</span>
                </h5>
              </div>
            </Col>
          )}
          <Col xs="12" itemProp="text">
          {list.name || (
                  <ItemNo value={key + 1}/>
                 )}
           <InlineMarkdown source={l.text} />
          </Col>
        </Row>
      </div>
    ))}
    <style jsx>
    {`
      .badge + p {
        display: inline;
      }
    `}
  </style>
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
