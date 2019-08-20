import React from 'react'
import { UserContext } from '../../context/UserContext'
import { Link } from '../../routes'
import * as v4 from 'uuid/v4'
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from 'reactstrap'
import * as _ from 'lodash'
import Head from 'next/head'
import Router from 'next/router'
import { Layout, IfLoggedIn } from '../../components'
import { api } from '../../common/http'
import { authenticated } from '../../common/auth'

const uuid = () =>
  v4()
    .replace(/-/gi, '')
    .substring(0, 24)

interface RegisterFormState {
  email: string
  password: string
  errors: string[]
  working: boolean
}

const InputStyle = {
  borderRadius: '0.1rem',
  borderColor: '#888'
}

class RegisterForm extends React.Component<{}, RegisterFormState> {
  constructor(props: any) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.signUpEnabled = this.signUpEnabled.bind(this)
    this.state = {
      email: '',
      password: '',
      errors: [],
      working: false
    }
  }

  public handleEmailChange(e) {
    const email = e.target.value || ''
    this.setState({ email })
  }

  public handlePasswordChange(e) {
    const password = e.target.value || ''
    this.setState({ password })
  }

  public async handleSubmit(
    event: React.FormEvent<EventTarget>,
    updateUser: any
  ) {
    event.preventDefault()
    this.setState({ working: true })
    const { email, password } = this.state
    const username = uuid()
    try {
      await api.createUser({ email, password, username })
      const { user, token, refreshToken } = await api.login({
        username,
        password
      })
      authenticated(token, refreshToken)
      api.setAuth(token, refreshToken)
      updateUser(user)
      // Onboard/Pro
      Router.push(`/pro/profile`)
    } catch (e) {
      this.setState({ errors: _.get(e, 'messages', []) })
    }
    this.setState({ working: false })
  }

  public signUpEnabled(): boolean {
    return Boolean(
      this.state.email.length &&
        this.state.password.length &&
        !this.state.working
    )
  }

  public render() {
    return (
      <UserContext.Consumer>
        {({ updateUser }) => (
          <>
            <nav className="p-3 text-center">
              <Link route="/">
                <a>
                  <img
                    src="https://static.platezero.com/assets/logo/platezero-pro-black.png"
                    alt="PlateZero Pro"
                    style={{ width: 200 }}
                  />
                </a>
              </Link>
            </nav>
            <Row>
              <Col
                xs="12"
                lg={{ size: 6, offset: 3 }}
                className="mt-3 text-center"
              >
                <Form
                  onSubmit={e => this.handleSubmit(e, updateUser)}
                  className="mt-6"
                >
                  <h2>Create an Account</h2>
                  <ul className="list-unstyled">
                    {this.state.errors.map((error, key) => (
                      <li key={key} className="text-danger">
                        {error}
                      </li>
                    ))}
                  </ul>
                  <FormGroup>
                    <Input
                      className="text-center"
                      type="email"
                      name="email"
                      id="emailField"
                      placeholder="Your Email"
                      autoFocus={true}
                      value={this.state.email}
                      onChange={this.handleEmailChange}
                      style={InputStyle}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      className="text-center"
                      type="password"
                      name="password"
                      id="passwordField"
                      placeholder="Password"
                      value={this.state.password}
                      onChange={this.handlePasswordChange}
                      style={InputStyle}
                    />
                  </FormGroup>
                  <Button
                    value="submit"
                    color="primary"
                    block={true}
                    disabled={!this.signUpEnabled()}
                  >
                    Create Account
                  </Button>
                </Form>
              </Col>
            </Row>
          </>
        )}
      </UserContext.Consumer>
    )
  }
}

export default class RegisterPage extends React.Component {
  public render() {
    return (
      <>
        <div
          style={{
            height: '100vh',
            backgroundColor: 'rgba(213, 232, 208, 0.5)'
          }}
        >
          <Container>
            <Head>
              <title>Sign up for PlateZero Pro</title>
            </Head>
            <IfLoggedIn else={<RegisterForm />}>
              <h1 className="mt-3">Sending you on your way...</h1>
            </IfLoggedIn>
          </Container>
        </div>
        <style jsx global>
          {`
            .pro input:focus {
              box-shadow: none;
            }
          `}
        </style>
      </>
    )
  }
}
