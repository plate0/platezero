import * as React from 'react'
import {
  Alert,
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap'
import Router from 'next/router'

interface LoginState {
  error: string
  password: string
  username: string
  redirect: boolean
}

const ErrorMessage = ({ err }: { err: string }) => (
  <Alert color="danger">{err}</Alert>
)

export default class Login extends React.Component<any, LoginState> {
  constructor(props: any) {
    super(props)
    this.state = {
      error: '',
      password: '',
      redirect: false,
      username: ''
    }
    this.login = this.login.bind(this)
    this.usernameChange = this.usernameChange.bind(this)
    this.passwordChange = this.passwordChange.bind(this)
  }

  public async login(event: React.FormEvent<EventTarget>) {
    event.preventDefault()
    const { username, password } = this.state
    try {
      // const { user, session } = await login({ username, password })
      // setItem('user', JSON.stringify(user))
      // setItem('session', JSON.stringify(session))
      this.setState({ redirect: true })
    } catch (err) {
      this.setState({ error: 'Incorrect username or password' })
    }
  }

  public usernameChange(event: React.FormEvent<HTMLInputElement>): void {
    const username = event.currentTarget.value
    this.setState({ username })
  }

  public passwordChange(event: React.FormEvent<HTMLInputElement>): void {
    const password = event.currentTarget.value
    this.setState({ password })
  }

  public render() {
    if (this.state.redirect) {
      Router.push(`/${this.state.username}`)
      return null
    }
    const error = this.state.error ? ErrorMessage(this.state.error) : undefined
    return (
      <Container>
        <div className="row justify-content-center">
          <div className="mt-3 col-12 col-md-8 col-lg-4">
            <div className="text-center">
              <h3 className="py-3">Sign in to PlateZero</h3>
            </div>
            {error}
            <div className="border rounded p-3">
              <Form onSubmit={this.login}>
                <FormGroup>
                  <Label for="username">
                    <strong>Username</strong>
                  </Label>
                  <Input
                    type="text"
                    name="username"
                    id="username"
                    required
                    autoFocus={true}
                    tabIndex={1}
                    value={this.state.username}
                    onChange={this.usernameChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="password">
                    <strong>Password</strong>
                  </Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    required
                    tabIndex={2}
                    value={this.state.password}
                    onChange={this.passwordChange}
                  />
                </FormGroup>
                <Button
                  type="submit"
                  color="primary"
                  className="btn-block"
                  disabled={!this.state.username || !this.state.password}
                >
                  Sign In
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </Container>
    )
  }
}
