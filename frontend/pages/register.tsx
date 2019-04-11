import React from 'react'
import { UserContext } from '../context/UserContext'
import {
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
import { Layout, IfLoggedIn } from '../components'
import { api } from '../common/http'
import { authenticated } from '../common/auth'

interface RegisterFormState {
  username: string
  email: string
  password: string
  errors: string[]
  working: boolean
}

class RegisterForm extends React.Component<{}, RegisterFormState> {
  constructor(props: any) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.signUpEnabled = this.signUpEnabled.bind(this)
    this.state = {
      username: '',
      email: '',
      password: '',
      errors: [],
      working: false
    }
  }

  public handleUsernameChange(e) {
    const username = e.target.value || ''
    this.setState({ username })
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
    const { username, password, email } = this.state
    try {
      await api.createUser({ username, password, email })
      const { user, token, refreshToken } = await api.login({
        username,
        password
      })
      authenticated(token, refreshToken)
      api.setAuth(token, refreshToken)
      updateUser(user)
      Router.push(`/${user.username}`)
    } catch (e) {
      this.setState({ errors: _.get(e, 'messages', []) })
    }
    this.setState({ working: false })
  }

  public signUpEnabled(): boolean {
    return Boolean(
      this.state.username.length &&
        this.state.email.length &&
        this.state.password.length &&
        !this.state.working
    )
  }

  public render() {
    return (
      <UserContext.Consumer>
        {({ updateUser }) => (
          <Row>
            <Col xs="12" lg={{ size: 6, offset: 3 }} className="mt-3">
              <h1>Sign Up for PlateZero</h1>
              <Form onSubmit={e => this.handleSubmit(e, updateUser)}>
                <ul>
                  {this.state.errors.map((error, key) => (
                    <li key={key} className="text-danger">
                      {error}
                    </li>
                  ))}
                </ul>
                <FormGroup>
                  <Label for="usernameField">Username</Label>
                  <Input
                    type="text"
                    name="username"
                    id="usernameField"
                    placeholder="Pick a username (what people will know you as)"
                    value={this.state.username}
                    onChange={this.handleUsernameChange}
                  />
                  <FormText>
                    Your username must be 2–25 characters long, start with a
                    letter, and consist only of letters, numbers, hyphens, and
                    underscores.
                  </FormText>
                </FormGroup>
                <FormGroup>
                  <Label for="emailField">Email Address</Label>
                  <Input
                    type="email"
                    name="email"
                    id="emailField"
                    placeholder="Your Email Address"
                    value={this.state.email}
                    onChange={this.handleEmailChange}
                  />
                  <FormText>
                    We’ll use this email address to help you access your account
                    if you forget your password. We never share your email or
                    spam you!
                  </FormText>
                </FormGroup>
                <FormGroup>
                  <Label for="passwordField">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    id="passwordField"
                    placeholder="Choose a strong password, at least 8 characters"
                    value={this.state.password}
                    onChange={this.handlePasswordChange}
                  />
                  <FormText>
                    <a href="https://howtochooseapassword.com" target="_blank">
                      Learn how to choose a good password
                    </a>
                  </FormText>
                </FormGroup>
                <Button
                  color="primary"
                  block={true}
                  disabled={!this.signUpEnabled()}
                >
                  Sign Up for PlateZero
                </Button>
              </Form>
            </Col>
          </Row>
        )}
      </UserContext.Consumer>
    )
  }
}

export default class RegisterPage extends React.Component {
  public render() {
    return (
      <Layout>
        <Head>
          <title>Sign up for PlateZero</title>
        </Head>
        <IfLoggedIn else={<RegisterForm />}>
          <h1 className="mt-3">You're good to go!</h1>
          <p>
            It looks like you are already logged into your PlateZero account. If
            you want to create a new account, you need to log out first.
          </p>
        </IfLoggedIn>
      </Layout>
    )
  }
}
