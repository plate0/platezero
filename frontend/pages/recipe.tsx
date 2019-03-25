import React from 'react'
import * as _ from 'lodash'
import ReactMarkdown from 'react-markdown'
import { Card, CardHeader, CardBody } from 'reactstrap'
import {
  Head,
  Layout,
  RecipeNav,
  RecipeVersion as RecipeVersionView
} from '../components'
import { RecipeJSON } from '../models/recipe'
import { RecipeVersionJSON } from '../models/recipe_version'
import { getRecipe, getRecipeVersion } from '../common/http'
import { Link } from '../routes'

interface RecipeProps {
  recipe: RecipeJSON
  recipeVersion?: RecipeVersionJSON
}

export default class Recipe extends React.Component<RecipeProps> {
  static async getInitialProps({ query }) {
    const recipe = await getRecipe(query.username, query.slug)
    const masterBranch = _.head(
      _.filter(recipe.branches, r => r.name === 'master')
    )
    const versionId = _.get(masterBranch, 'recipe_version_id')
    const recipeVersion = versionId
      ? await getRecipeVersion(query.username, query.slug, versionId)
      : undefined
    return { recipe, recipeVersion }
  }

  public render() {
    const { recipe, recipeVersion } = this.props
    return (
      <Layout>
        <Head
          title={`${recipe.title} - PlateZero`}
          description={recipe.description}
          image={recipe.image_url}
          url={`/${recipe.owner.username}/${recipe.slug}`}
        />
        <RecipeNav recipe={recipe} />
        {recipeVersion && <RecipeEditButton recipe={recipe} branch="master" />}
        {recipe.description && (
          <Card className="mb-3">
            <CardHeader>
              <strong>About {recipe.title}</strong>
            </CardHeader>
            <CardBody>
              <ReactMarkdown
                source={recipe.description}
                disallowedTypes={[
                  'link',
                  'image',
                  'linkReference',
                  'imageReference',
                  'html',
                  'virtualHtml'
                ]}
              />
            </CardBody>
          </Card>
        )}
        {recipeVersion && <RecipeVersionView recipeVersion={recipeVersion} />}
      </Layout>
    )
  }
}

interface RecipeEditButtonProps {
  recipe: RecipeJSON
  branch: string
}
const RecipeEditButton = (props: RecipeEditButtonProps) => (
  <Link
    route={`/${props.recipe.owner.username}/${props.recipe.slug}/branches/${
      props.branch
    }/edit`}
  >
    <a className="btn btn-secondary">Edit</a>
  </Link>
)
