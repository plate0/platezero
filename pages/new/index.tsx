import { gql, useMutation } from '@apollo/client'
import { Layout } from 'components'
import { CreateRecipe, CreateRecipeVariables } from 'queries/CreateRecipe'
import { useState } from 'react'
import { Button } from 'reactstrap'

const CreateRecipeMutation = gql`
  mutation CreateRecipe($input: CreateRecipeInput!) {
    createRecipe(input: $input) {
      recipe {
        slug
      }
    }
  }
`

const InitialState = {
  title: 'hi',
  ingredients: 'hi',
  procedure: 'hi',
  slug: 'oops'
}

export default function NewRecipePage() {
  const [input, _setInput] = useState(InitialState)
  const [create] = useMutation<CreateRecipe, CreateRecipeVariables>(
    CreateRecipeMutation,
    {
      onCompleted: (data: CreateRecipe) => {
        console.log('Created!', data)
        // redirect to new user page
      }
    }
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    create({
      variables: {
        input: { recipe: { ...input, userId: 1 } }
      }
    })
  }

  return (
    <Layout>
      <form onSubmit={onSubmit}>
        <input></input>
        <textarea />
        <textarea />
        <Button>Submit</Button>
      </form>
    </Layout>
  )
}
