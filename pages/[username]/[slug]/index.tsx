import { gql } from '@apollo/client'
import { Header, Main } from 'components'
import { getParams } from 'hooks'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { getClient } from 'queries'
import {
  RecipeQuery,
  RecipeQueryVariables,
  RecipeQuery_recipeBySlug
} from 'queries/RecipeQuery'

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

interface TitleProps {
  title: string
  username: string
}

const Title = ({ slug, title, username }) => (
  <>
    <h1 className="text-2xl">{title}</h1>
    <Link href={`/${username}`}>
      <a>{username}</a>
    </Link>
  </>
  // <div className="text-2xl text-blue-700 flex gap-x-2">
  //   <Link href={`/${username}`}>
  //     <a>{username}</a>
  //   </Link>
  //   <span className="text-gray-600">/</span>
  //   <Link href={`/${username}/${slug}`}>
  //     <a>{slug}</a>
  //   </Link>
  // </div>
)

interface Props {
  recipe: RecipeQuery_recipeBySlug
}

export default function RecipePage({ recipe }: Props) {
  const username = recipe.userByUserId.username
  return (
    <>
      <Head>
        <title>{recipe.title}</title>
      </Head>
      <Header />
      <Main>
        <Title slug={recipe.slug} title={recipe.title} username={username} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 whitespace-pre-line">
            <h2 className="text-xl">Ingredients</h2>
            {recipe.ingredients}
          </div>
          <div className="col-span-1 whitespace-pre-line">
            <h2 className="text-xl">Procedure</h2>
            {recipe.procedure}
          </div>
        </div>
      </Main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username, slug } =
    getParams<{ username: string; slug: string }>(context)
  try {
    const { data } = await getClient(context).query<
      RecipeQuery,
      RecipeQueryVariables
    >({
      query,
      variables: {
        username,
        slug
      }
    })
    return {
      props: {
        recipe: data.recipeBySlug
      }
    }
  } catch (err) {
    console.error(err)
    return {
      notFound: true
    }
  }
}
