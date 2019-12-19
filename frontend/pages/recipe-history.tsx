import * as _ from 'lodash'
import React from 'react'
import { Col, ListGroup, ListGroupItem, Row } from 'reactstrap'
import { api } from '../common/http'
import { getName } from '../common/model-helpers'
import {
  fetchRecipeLayoutProps,
  Markdown,
  ProfilePicture,
  RecipeLayout,
  RecipeLayoutProps,
  Timestamp
} from '../components'
import { RecipeVersionJSON } from '../models'
import { Link } from '../routes'

interface Props {
  layoutProps: RecipeLayoutProps
  versions?: RecipeVersionJSON[]
}

export default class RecipeHistory extends React.Component<Props> {
  static async getInitialProps({ pathname, query, res }): Promise<Props> {
    const layoutProps = await fetchRecipeLayoutProps({ pathname, query, res })
    try {
      const versions = await api.getRecipeVersions(
        layoutProps.recipe.owner.username,
        layoutProps.recipe.slug
      )
      return { layoutProps, versions }
    } catch {
      return { layoutProps }
    }
  }

  public render() {
    const { layoutProps, versions } = this.props
    const { recipe, viewingVersion } = layoutProps
    const { owner, slug } = recipe
    return (
      <RecipeLayout {...layoutProps} condensedHeader={true}>
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
                        route={`/${owner.username}/${slug}/versions/${v.id}`}
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
                    {v.id === viewingVersion.id ? (
                      <span className="text-success">currently viewing</span>
                    ) : (
                      <Link
                        route={`/${owner.username}/${slug}/versions/${v.id}`}
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
