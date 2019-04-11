import * as React from 'react'
import { Alert, Button, Container, Form, FormGroup, Label } from 'reactstrap'
import { authenticated, api } from '../common'
import Router from 'next/router'
import { Layout } from '../components'
import { UserContext } from '../context/UserContext'
import Head from 'next/head'

interface LoginState {
  error: string
}

const ErrorMessage = ({ err }: { err: string }) => (
  <Alert color="danger">{err}</Alert>
)

export default class Login extends React.Component<any, LoginState> {
  private usernameInput
  private passwordInput

  constructor(props: any) {
    super(props)
    this.state = { error: '' }
    this.login = this.login.bind(this)
    this.usernameInput = React.createRef()
    this.passwordInput = React.createRef()
  }

  public async login(event: React.FormEvent<EventTarget>, update: any) {
    event.preventDefault()
    const username = this.usernameInput.current.value
    const password = this.passwordInput.current.value
    try {
      const { user, token, refreshToken } = await api.login({
        username,
        password
      })
      authenticated(token, refreshToken)
      api.setAuth(token, refreshToken)
      update(user)
      Router.push(`/${user.username}`)
    } catch (err) {
      this.setState({ error: 'Incorrect username or password' })
    }
  }

  public render() {
    const error = this.state.error ? (
      <ErrorMessage err={this.state.error} />
    ) : null
    return (
      <UserContext.Consumer>
        {({ updateUser }) => (
          <Layout>
            <Head>
              <title>Log in to PlateZero</title>
            </Head>
            <Container>
              <div className="row justify-content-center">
                <div className="mt-3 col-12 col-md-8 col-lg-4">
                  <div className="text-center">
                    <h3 className="py-3">Log in to PlateZero</h3>
                  </div>
                  {error}
                  <div className="border rounded p-3">
                    <Form onSubmit={e => this.login(e, updateUser)}>
                      <FormGroup>
                        <Label for="username">
                          <strong>Username</strong>
                        </Label>
                        <input
                          type="text"
                          name="username"
                          className="form-control"
                          ref={this.usernameInput}
                          required
                          autoFocus={true}
                          tabIndex={1}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for="password">
                          <strong>Password</strong>
                        </Label>
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          ref={this.passwordInput}
                          required
                          tabIndex={2}
                        />
                      </FormGroup>
                      <Button
                        type="submit"
                        color="primary"
                        className="btn-block"
                      >
                        Sign In
                      </Button>
                    </Form>
                  </div>
                </div>
              </div>
            </Container>
          </Layout>
        )}
      </UserContext.Consumer>
    )
  }
}
