import { ApolloError, gql, useMutation } from '@apollo/client'
import { AlertErrors, Header } from 'components'
import { asContainer } from 'components/container'
import { FormInput, FormTextarea } from 'components/input'
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
  title: '',
  ingredients: '',
  procedure: '',
  slug: ''
}

export default function NewRecipePage() {
  const [err, setErr] = useState('')
  const [input, setInput] = useState(InitialState)
  const [create] = useMutation<CreateRecipe, CreateRecipeVariables>(
    CreateRecipeMutation,
    {
      onCompleted: (data: CreateRecipe) => {
        console.log('Created!', data)
        // redirect to new user page
      },
      onError: (error: ApolloError) => setErr(error.message)
    }
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    create({
      variables: {
        input: { recipe: { ...input, userId: 2 } }
      }
    })
  }

  return (
    <>
      <Header />
      {!!err && <AlertErrors errors={[err]} />}
      <form onSubmit={onSubmit} className={asContainer('py-8')}>
        <h1 className="text-xl">Create New Recipe</h1>
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
        <Button>Submit</Button>
      </form>
    </>
  )
}
