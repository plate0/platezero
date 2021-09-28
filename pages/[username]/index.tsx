import { gql } from '@apollo/client'
import { Layout } from 'components'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { client } from 'queries'
import {
  UserPageQuery,
  UserPageQueryVariables,
  UserPageQuery_userByUsername
} from 'queries/UserPageQuery'

const query = gql`
  query UserPageQuery($username: String!) {
    userByUsername(username: $username) {
      username
      recipesByUserId {
        edges {
          node {
            title
            slug
            description
          }
        }
      }
    }
  }
`

interface Props {
  data: UserPageQuery_userByUsername
}

export default function UserPage({ data }: Props) {
  if (!data) {
    return <>404</>
  }
  return (
    <Layout>
      <p>{data.username}</p>
      <div>Recipes</div>
      <ul>
        {data.recipesByUserId.edges.map(({ node }) => (
          <li key={node.slug}>
            <Link href={`/${data.username}/${node.slug}`}>
              <a>
                <div>{node.title}</div>
                <div>{node.description}</div>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const username = context.query.username as string
  const { data } = await client.query<UserPageQuery, UserPageQueryVariables>({
    query,
    variables: {
      username
    }
  })
  return {
    props: {
      data: data.userByUsername
    }
  }
}
