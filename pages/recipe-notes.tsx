import React from 'react'
import * as _ from 'lodash'
import {
  RecipeLayout,
  RecipeLayoutProps,
  fetchRecipeLayoutProps,
  RecipeNotes
} from '../components'

export default class NotesPage extends React.Component<RecipeLayoutProps> {
  static async getInitialProps({
    pathname,
    query,
    res
  }): Promise<RecipeLayoutProps> {
    return await fetchRecipeLayoutProps({ pathname, query, res })
  }

  public render() {
    const { recipe, viewingVersion } = this.props
    return (
      <RecipeLayout {...this.props} condensedHeader={true}>
        <RecipeNotes recipe={recipe} currentVersionId={viewingVersion.id} />
      </RecipeLayout>
    )
  }
}
