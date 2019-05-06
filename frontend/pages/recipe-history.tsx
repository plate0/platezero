import React from 'react'
import ErrorPage from './_error'
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap'
import * as _ from 'lodash'
import {
  RecipeLayout,
  Timestamp,
  ProfilePicture,
  Markdown
} from '../components'
import { RecipeJSON, RecipeVersionJSON } from '../models'
import { api } from '../common/http'
import { getName } from '../common/model-helpers'
import { Link } from '../routes'
import { maybeNumber } from '../common/number'

interface Props {
  recipe?: RecipeJSON
  versionId?: number
  versions?: RecipeVersionJSON[]
  noteCount?: number
  pathname: string
  statusCode?: number
}

export default class RecipeHistory extends React.Component<Props> {
  static async getInitialProps({ pathname, query, res }): Promise<Props> {
    try {
      const { username, slug, versionId } = query
      const recipe = await api.getRecipe(username, slug)
      const versions = await api.getRecipeVersions(username, slug)
      const noteCount = (await api.getRecipeNotes(username, slug)).length
      return {
        recipe,
        versionId: maybeNumber(versionId),
        versions,
        noteCount,
        pathname
      }
    } catch (err) {
      const statusCode = err.statusCode || 500
      if (res) {
        res.statusCode = statusCode
      }
      return { pathname, statusCode }
    }
  }

  public render() {
    const {
      recipe,
      versionId,
      versions,
      noteCount,
      pathname,
      statusCode
    } = this.props
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />
    }
    return (
      <RecipeLayout
        recipe={recipe}
        title={`History of ${recipe.title} - PlateZero`}
        description={recipe.description}
        url={recipe.html_url}
        pathname={pathname}
        condensedHeader={true}
        versionId={versionId}
        noteCount={noteCount}
      >
        <ListGroup className="mb-3">
          {versions.map(v => {
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
                    {v.id === versionId ? (
                      <span className="text-success">currently viewing</span>
                    ) : (
                      <Link
                        route={`/${recipe.owner.username}/${
                          recipe.slug
                        }/versions/${v.id}`}
                      >
                        <a className="btn btn-outline-primary">Show Version</a>
                      </Link>
                    )}
                  </Col>
                </Row>
              </ListGroupItem>
            )
          })}
        </ListGroup>
      </RecipeLayout>
    )
  }
}
