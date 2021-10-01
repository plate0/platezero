import { gql, useMutation } from '@apollo/client'
import { useCookie } from 'next-cookie'
import { Login, LoginVariables } from 'queries/Login'
import { useState } from 'react'

const LoginMutation = gql`
  mutation Login($input: AuthenticateInput!) {
    authenticate(input: $input) {
      jwtToken
    }
  }
`

const InitialState = {
  username: '',
  password: ''
}

export default function LoginPage() {
  const cookie = useCookie()
  const [input, setInput] = useState(InitialState)
  const [login] = useMutation<Login, LoginVariables>(LoginMutation, {
    onCompleted: (data) => {
      cookie.set('AUTH_TOKEN', data.authenticate.jwtToken)
    },
    onError: console.error
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({
      variables: {
        input
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="mb-3">
      <input
        type="text"
        name="username"
        className="form-control"
        autoCapitalize="none"
        required
        autoFocus={true}
        tabIndex={1}
        value={input.username}
        onChange={(e) => setInput({ ...input, username: e.target.value })}
      />
      <input
        type="password"
        name="password"
        className="form-control"
        required
        tabIndex={2}
        value={input.password}
        onChange={(e) => setInput({ ...input, password: e.target.value })}
      />
      <button type="submit" color="primary" className="btn-block">
        Sign In
      </button>
    </form>
  )
}
