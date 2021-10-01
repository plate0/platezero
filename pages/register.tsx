import { gql, useMutation } from '@apollo/client'
import { RegisterVariables, Register_registerUser } from 'queries/Register'
import { useState } from 'react'

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
  const [input, setInput] = useState(InitialState)
  const [register] = useMutation<Register_registerUser, RegisterVariables>(
    RegisterMutation,
    {
      onCompleted: (data: Register_registerUser) => {
        console.log('Created!', data)
        // redirect to new user page
      }
    }
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register({
      variables: {
        input
      }
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="username"
        autoCapitalize="none"
        placeholder="Pick a username (what people will know you as)"
        value={input.username}
        onChange={(e) => setInput({ ...input, username: e.target.value })}
      />
      <input
        type="password"
        name="password"
        placeholder="Choose a strong password, at least 8 characters"
        value={input.password}
        onChange={(e) => setInput({ ...input, password: e.target.value })}
      />
      <button>Sign Up for PlateZero</button>
    </form>
  )
}
