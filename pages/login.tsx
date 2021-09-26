import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import * as React from 'react'
import { Alert, Button, Container, Form, FormGroup, Label } from 'reactstrap'
import { api, authenticated } from '../common'
import { Layout } from '../components'
import { UserContext } from '../context/UserContext'

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
                  <div className="border rounded p-3 mb-3">
                    <Form
                      onSubmit={(e) => this.login(e, updateUser)}
                      className="mb-3"
                    >
                      <FormGroup>
                        <Label for="username">
                          <strong>Username</strong>
                        </Label>
                        <input
                          type="text"
                          name="username"
                          className="form-control"
                          autoCapitalize="none"
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
                    <div className="small text-muted text-center">
                      Forgot your password? Email{' '}
                      <a href="mailto:hello@platezero.com">
                        hello@platezero.com
                      </a>{' '}
                      and we'll get it sorted out!
                    </div>
                  </div>
                  <Link href="/register" passHref>
                    <Button color="primary" outline block className="my-3">
                      Sign up for PlateZero now!
                    </Button>
                  </Link>
                </div>
              </div>
            </Container>
          </Layout>
        )}
      </UserContext.Consumer>
    )
  }
}
