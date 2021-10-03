import { gql, useMutation, useQuery } from '@apollo/client'
import { asContainer, FormInput, FormTextarea } from 'components'
import { useParams } from 'hooks'
import {
  EditRecipeQuery,
  EditRecipeQueryVariables,
  EditRecipeQuery_recipeBySlug
} from 'queries/EditRecipeQuery'
import { UpdateRecipe, UpdateRecipeVariables } from 'queries/UpdateRecipe'
import { useState } from 'react'

const mutation = gql`
  mutation UpdateRecipe($recipePatch: RecipePatch!, $id: Int!) {
    updateRecipeById(input: { recipePatch: $recipePatch, id: $id }) {
      recipe {
        slug
        userByUserId {
          username
        }
      }
    }
  }
`

const query = gql`
  query EditRecipeQuery($slug: String!, $username: String!) {
    recipeBySlug(slug: $slug, username: $username) {
      id
      title
      description
      yield
      duration
      ingredients
      procedure
    }
  }
`

export default function EditPage() {
  const { username, slug, router } = useParams<{
    username: string
    slug: string
  }>()
  const [input, setInput] = useState<EditRecipeQuery_recipeBySlug>({} as any)
  useQuery<EditRecipeQuery, EditRecipeQueryVariables>(query, {
    skip: !slug,
    variables: {
      username,
      slug
    },
    onCompleted: (data: EditRecipeQuery) => setInput(data.recipeBySlug)
  })
  const [edit] = useMutation<UpdateRecipe, UpdateRecipeVariables>(mutation, {
    onCompleted: () => router.push(`/${username}/${slug}`)
  })
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // https://github.com/apollographql/apollo-client/issues/1913
    const fixed = {
      ...input
    }
    delete fixed['__typename']
    edit({
      variables: {
        id: input.id,
        recipePatch: fixed
      }
    })
  }
  return (
    <form onSubmit={onSubmit} className={asContainer('py-8')}>
      <div>EDIT</div>
      <FormInput
        label="Title"
        placeholder="Recipe title"
        value={input.title}
        onChange={(e) => setInput({ ...input, title: e.target.value })}
      />

      <FormTextarea
        label="Ingredients"
        value={input.ingredients}
        onChange={(e) => setInput({ ...input, ingredients: e.target.value })}
      />
      <FormTextarea
        label="Steps"
        value={input.procedure}
        onChange={(e) => setInput({ ...input, procedure: e.target.value })}
      />
      <button>Submit</button>
    </form>
  )
}
