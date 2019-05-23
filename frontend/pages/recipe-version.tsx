import React from 'react'
import * as _ from 'lodash'
import { Card, CardHeader, CardBody } from 'reactstrap'
import {
  RecipeLayout,
  RecipeLayoutProps,
  fetchRecipeLayoutProps,
  RecipeVersion,
  Timestamp,
  Markdown,
  PinnedNotes
} from '../components'
import { Link } from '../routes'
import { getName } from '../common/model-helpers'

export default class RecipeVersionPage extends React.Component<
  RecipeLayoutProps
> {
  static async getInitialProps({ query, res, pathname }) {
    return await fetchRecipeLayoutProps({ query, res, pathname })
  }

  public render() {
    const { recipe, viewingVersion } = this.props
    const { owner, slug } = recipe
    return (
      <RecipeLayout {...this.props} condensedHeader={true}>
        <Card className="mb-3">
          <CardHeader className="theme-warning d-flex align-items-center justify-content-between">
            <div>Viewing a specific version of this recipe</div>
            <Link route="recipe" params={{ username: owner.username, slug }}>
              <a className="btn btn-link btn-sm">Show Master Version</a>
            </Link>
          </CardHeader>
          <CardBody>
            <Markdown source={viewingVersion.message} />
            <div className="text-secondary small mt-3">
              Authored <Timestamp t={viewingVersion.created_at} /> by{' '}
              <Link
                route="/user"
                params={{ username: viewingVersion.author.username }}
              >
                <a className="font-weight-bold text-secondary">
                  {getName(viewingVersion.author)}
                </a>
              </Link>
            </div>
          </CardBody>
        </Card>
        <PinnedNotes />
        <RecipeVersion version={viewingVersion} />
      </RecipeLayout>
    )
  }
}
