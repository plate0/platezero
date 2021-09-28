import { gql, useQuery } from '@apollo/client'
import { Header } from 'components'
import { Container } from 'components/container'
import { useParams } from 'hooks'
import { RecipeQuery, RecipeQueryVariables } from 'queries/RecipeQuery'

const query = gql`
  query RecipeQuery($slug: String!) {
    recipeBySlug(slug: $slug) {
      id
      slug
      title
      ingredients
      description
      procedure
    }
  }
`

export default function RecipePage() {
  const { slug } = useParams<{ slug: string }>()
  const { data } = useQuery<RecipeQuery, RecipeQueryVariables>(query, {
    skip: !slug,
    variables: {
      slug
    }
  })
  console.log(data)
  if (!data?.recipeBySlug) {
    return null
  }
  return (
    <>
      <Header />
      <Container>
        <div>{data.recipeBySlug.title}</div>
        <div>{data.recipeBySlug.ingredients}</div>
        <div>{data.recipeBySlug.procedure}</div>
      </Container>
    </>
  )
}
