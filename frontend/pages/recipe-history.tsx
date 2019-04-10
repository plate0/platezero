import React from 'react'
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap'
import * as _ from 'lodash'
import * as ReactMarkdown from 'react-markdown'

import {
  Head,
  Layout,
  RecipeTitle,
  RecipeNav,
  Timestamp,
  ProfilePicture
} from '../components'
import { RecipeJSON, RecipeVersionJSON } from '../models'
import { getRecipe, getRecipeVersions } from '../common/http'
import { getName } from '../common/model-helpers'
import { Link } from '../routes'

interface Props {
  recipe: RecipeJSON
  versions: RecipeVersionJSON[]
  pathname: string
}

export default class RecipeHistory extends React.Component<Props> {
  static async getInitialProps({ pathname, query }): Promise<Props> {
    const recipe = await getRecipe(query.username, query.slug)
    const versions = await getRecipeVersions(query.username, query.slug)
    return { recipe, versions, pathname }
  }

  public render() {
    const { recipe } = this.props
    return (
      <Layout>
        <Head
          title={`History of ${recipe.title} - PlateZero`}
          description={recipe.description}
          image={recipe.image_url}
          url={`/${recipe.owner.username}/${recipe.slug}`}
        />
        <div className="mt-3">
          <RecipeTitle recipe={recipe} />
        </div>
        <RecipeNav recipe={recipe} route={this.props.pathname} />
        <ListGroup className="mb-3">
          {this.props.versions.map(v => {
            const lines = _.split(v.message, '\n\n')
            const rest = _.join(_.tail(lines), '\n\n')
            return (
              <ListGroupItem key={v.id}>
                <Row className="align-items-center">
                  <Col>
                    <div className="pb-1">
                      <Link
                        route={`/${recipe.owner.username}/${
                          recipe.slug
                        }/versions/${v.id}`}
                      >
                        <a>{_.head(lines)}</a>
                      </Link>
                    </div>
                    <div className="small text-muted">
                      <Link route={`/${v.author.username}`}>
                        <a>
                          <ProfilePicture img={v.author.avatar_url} size={20} />
                          <span className="pl-2">{getName(v.author)}</span>
                        </a>
                      </Link>{' '}
                      authored <Timestamp t={v.created_at} />
                    </div>
                    {rest && (
                      <div className="text-secondary small">
                        <ReactMarkdown source={rest} />
                      </div>
                    )}
                  </Col>
                  <Col xs="auto" className="ml-auto">
                    <Link
                      route={`/${recipe.owner.username}/${
                        recipe.slug
                      }/versions/${v.id}`}
                    >
                      <a className="btn btn-outline-primary">Show Version</a>
                    </Link>
                  </Col>
                </Row>
              </ListGroupItem>
            )
          })}
        </ListGroup>
      </Layout>
    )
  }
}