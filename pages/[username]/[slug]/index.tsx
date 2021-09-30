import { gql, useQuery } from '@apollo/client'
import { Header } from 'components'
import { Container } from 'components/container'
import { useParams } from 'hooks'
import Link from 'next/link'
import { RecipeQuery, RecipeQueryVariables } from 'queries/RecipeQuery'

const query = gql`
  query RecipeQuery($slug: String!, $username: String!) {
    recipeBySlug(slug: $slug, username: $username) {
      id
      slug
      title
      ingredients
      description
      procedure
      userByUserId {
        username
      }
    }
  }
`

export default function RecipePage() {
  const { username, slug } = useParams<{ username: string; slug: string }>()
  const { data } = useQuery<RecipeQuery, RecipeQueryVariables>(query, {
    skip: !slug,
    variables: {
      username,
      slug
    }
  })
  if (!data?.recipeBySlug) {
    return null
  }
  return (
    <>
      <Header />
      <Container>
        <Link href={`/${username}`}>
          <a>{username}</a>
        </Link>
        <Link href={`/${username}/${slug}/edit`}>
          <a>Edit</a>
        </Link>
        <h1 className="text-lg mb-4">{data.recipeBySlug.title}</h1>
        <div>It takes 1.5 hours to make. | Yields about 12 servings.</div>
        <div className="grid grid-cols-2">
          <div className="col-span-1 whitespace-pre-line">
            {data.recipeBySlug.ingredients}
          </div>
          <div className="col-span-1 whitespace-pre-line">
            {data.recipeBySlug.procedure}
          </div>
        </div>
      </Container>
    </>
  )
}
