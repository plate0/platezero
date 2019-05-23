import React from 'react'
import * as _ from 'lodash'
import {
  fetchRecipeLayoutProps,
  RecipeLayoutProps,
  RecipeLayout,
  RecipeVersion,
  PinnedNotes,
  Markdown
} from '../components'

export default class Recipe extends React.Component<RecipeLayoutProps> {
  static async getInitialProps(ctx): Promise<RecipeLayoutProps> {
    return await fetchRecipeLayoutProps(ctx)
  }

  public componentDidMount() {
    setTimeout(() => (document.body.scrollTop = 56))
  }

  public render() {
    const { recipe, viewingVersion } = this.props
    const { description } = recipe
    return (
      <RecipeLayout {...this.props}>
        {description && <Markdown source={description} />}
        <PinnedNotes />
        <RecipeVersion version={viewingVersion} />
      </RecipeLayout>
    )
  }
}
