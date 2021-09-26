import { gql, useMutation } from '@apollo/client'
import { RegisterVariables, Register_registerUser } from 'queries/Register'
import { useState } from 'react'
import { Button, Form, Input } from 'reactstrap'

const RegisterMutation = gql`
  mutation Register($input: RegisterUserInput!) {
    registerUser(input: $input) {
      user {
        username
      }
    }
  }
`

const InitialState = {
  username: '',
  password: ''
}

export default function RegisterPage() {
  const [register] = useMutation<Register_registerUser, RegisterVariables>(
    RegisterMutation,
    {
      onCompleted: (data: Register_registerUser) => {
        console.log('Created!', data)
        // redirect to new user page
      }
    }
  )
  const [input, setInput] = useState(InitialState)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register({
      variables: {
        input
      }
    })
  }

  return (
    <Form onSubmit={onSubmit}>
      <Input
        type="text"
        name="username"
        autoCapitalize="none"
        placeholder="Pick a username (what people will know you as)"
        value={input.username}
        onChange={(e) => setInput({ ...input, username: e.target.value })}
      />
      <Input
        type="password"
        name="password"
        placeholder="Choose a strong password, at least 8 characters"
        value={input.password}
        onChange={(e) => setInput({ ...input, password: e.target.value })}
      />
      <Button color="primary" block={true}>
        Sign Up for PlateZero
      </Button>
    </Form>
  )
}
