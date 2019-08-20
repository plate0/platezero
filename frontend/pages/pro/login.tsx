import * as React from 'react'
import { Alert, Button, Container, Form, FormGroup, Label } from 'reactstrap'
import { authenticated, api } from '../../common'
import Router from 'next/router'
import { Layout } from '../../components'
import { UserContext } from '../../context/UserContext'
import Head from 'next/head'
import { Link } from '../../routes'

interface LoginState {
  error: string
}

const ErrorMessage = ({ err }: { err: string }) => (
  <Alert color="danger">{err}</Alert>
)

export default class ProLogin extends React.Component<any, LoginState> {
  private emailInput
  private passwordInput

  constructor(props: any) {
    super(props)
    this.state = { error: '' }
    this.login = this.login.bind(this)
    this.emailInput = React.createRef()
    this.passwordInput = React.createRef()
  }

  public async login(event: React.FormEvent<EventTarget>, update: any) {
    event.preventDefault()
    const email = this.emailInput.current.value
    const password = this.passwordInput.current.value
    console.log('email', email)
    try {
      const { user, token, refreshToken } = await api.login({
        email,
        password
      })
      authenticated(token, refreshToken)
      api.setAuth(token, refreshToken)
      update(user)
      Router.push('/pro/profile')
    } catch (err) {
      this.setState({ error: 'Incorrect email or password' })
    }
  }

  public componentDidMount() {
    if (document) {
      document.body.className += ' ' + 'bg-light'
    }
  }

  public componentWillUnmount() {
    document.body.className = ''
  }

  public render() {
    const error = this.state.error ? (
      <ErrorMessage err={this.state.error} />
    ) : null
    return (
      <UserContext.Consumer>
        {({ updateUser }) => (
          <>
            <Head>
              <title>Log in to PlateZero Pro</title>
            </Head>
            <Container>
              <div className="row justify-content-center">
                <div className="mt-3 col-12 col-md-8 col-lg-4">
                  <div className="text-center">
                    <h3 className="py-3">Log in to PlateZero Pro</h3>
                  </div>
                  {error}
                  <div className="border rounded p-3 mb-3 bg-white">
                    <Form
                      onSubmit={e => this.login(e, updateUser)}
                      className="mb-3"
                    >
                      <FormGroup>
                        <Label for="email">
                          <strong>Email</strong>
                        </Label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          autoCapitalize="none"
                          ref={this.emailInput}
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
                  <Link to="/pro/register" passHref>
                    <Button color="primary" outline block className="my-3">
                      Sign up for PlateZero Pro now!
                    </Button>
                  </Link>
                </div>
              </div>
            </Container>
          </>
        )}
      </UserContext.Consumer>
    )
  }
}
