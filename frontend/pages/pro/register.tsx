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
            <Head>
              <title>Register for PlateZero Pro</title>
            </Head>
            <Container>
              <Row className="justify-content-center">
                <Col xs="12" md="8" lg="4" className="mt-3">
                  <div className="text-center">
                    <h3 className="py-3">Register for PlateZero Pro</h3>
                  </div>

                  <div className="border rounded p-3 mb-3 bg-white">
                    <Form
                      onSubmit={e => this.handleSubmit(e, updateUser)}
                      className="mb-3"
                    >
                      <FormGroup>
                        <Label for="email">
                          <strong>Email</strong>
                        </Label>
                        <Input
                          type="email"
                          name="email"
                          id="emailField"
                          placeholder="Your Email"
                          autoFocus={true}
                          value={this.state.email}
                          onChange={this.handleEmailChange}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for="password">
                          <strong>Password</strong>
                        </Label>
                        <Input
                          type="password"
                          name="password"
                          id="passwordField"
                          placeholder="Password"
                          value={this.state.password}
                          onChange={this.handlePasswordChange}
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
                  </div>
                </Col>
              </Row>
            </Container>
          </>
        )}
      </UserContext.Consumer>
    )
  }
}

export default class RegisterPage extends React.Component {
  public componentDidMount() {
    if (document) {
      document.body.className += ' ' + 'bg-light'
    }
  }

  public componentWillUnmount() {
    document.body.className = ''
  }
  public render() {
    return (
      <Container>
        <Head>
          <title>Sign up for PlateZero Pro</title>
        </Head>
        <RegisterForm />
        <div className="text-center mt-3">
          <Link route="pro-login">
            <a>Already have an account? Log in.</a>
          </Link>
        </div>
      </Container>
    )
  }
}
