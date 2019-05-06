import React from 'react'
import { Row, Col } from 'reactstrap'
import * as _ from 'lodash'
import { Head, Layout, RecipeHeader, RecipeNav } from '../components'
import { RecipeJSON } from '../models'

export const RecipeLayout = ({
  title,
  description,
  url,
  recipe,
  pathname,
  condensedHeader,
  versionId,
  noteCount,
  children
}: {
  title: string
  description: string
  url: string
  recipe: RecipeJSON
  pathname: string
  condensedHeader?: boolean
  versionId?: number
  noteCount: number
  children: any
}) => {
  return (
    <Layout>
      <Head
        title={title}
        description={description}
        image={recipe.image_url}
        url={url}
      />
      <Row className="position-relative">
        <RecipeHeader recipe={recipe} condensed={!!condensedHeader} />
      </Row>
      <Row>
        <Col xs="12" className="px-0 px-sm-3">
          <RecipeNav
            recipe={recipe}
            versionId={versionId}
            route={pathname}
            noteCount={noteCount}
          />
        </Col>
      </Row>
      {children}
    </Layout>
  )
}
