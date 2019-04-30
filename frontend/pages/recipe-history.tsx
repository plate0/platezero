import React from 'react'
import ErrorPage from './_error'
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap'
import * as _ from 'lodash'
import {
  Head,
  Layout,
  RecipeVersionHeader,
  RecipeNav,
  Timestamp,
  ProfilePicture,
  Markdown
} from '../components'
import { RecipeJSON, RecipeVersionJSON } from '../models'
import { api } from '../common/http'
import { getName } from '../common/model-helpers'
import { Link } from '../routes'

interface Props {
  recipe?: RecipeJSON
  versions?: RecipeVersionJSON[]
  pathname: string
  statusCode?: number
}

export default class RecipeHistory extends React.Component<Props> {
  static async getInitialProps({ pathname, query, res }): Promise<Props> {
    try {
      const recipe = await api.getRecipe(query.username, query.slug)
      const versions = await api.getRecipeVersions(query.username, query.slug)
      return { recipe, versions, pathname }
    } catch (err) {
      const statusCode = err.statusCode || 500
      if (res) {
        res.statusCode = statusCode
      }
      return { pathname, statusCode }
    }
  }

  public render() {
    const { recipe, statusCode } = this.props
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />
    }
    console.log(recipe)
    return (
      <Layout>
        <Head
          title={`History of ${recipe.title} - PlateZero`}
          description={recipe.description}
          image={recipe.image_url}
          url={`/${recipe.owner.username}/${recipe.slug}`}
        />
        <Row className="position-relative">
          <RecipeVersionHeader
            version={_.first(this.props.versions)}
            recipe={recipe}
          />
        </Row>
        <Row>
          <Col xs="12" className="px-0 px-sm-3">
            <RecipeNav recipe={recipe} route={this.props.pathname} />
          </Col>
        </Row>
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
                        <Markdown source={rest} />
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
