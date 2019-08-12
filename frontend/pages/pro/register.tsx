import React from 'react'
import { UserContext } from '../../context/UserContext'
import { Link } from '../../routes'
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
import '../../style/pro.scss'

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
    try {
      await api.createUser({ email, password })
      const { user, token, refreshToken } = await api.login({
        email,
        password
      })
      authenticated(token, refreshToken)
      api.setAuth(token, refreshToken)
      updateUser(user)
      // Onboard/Pro
      Router.push(`/${user.username}`)
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
          <Row>
            <Col
              xs="12"
              lg={{ size: 6, offset: 3 }}
              className="mt-3 text-center"
            >
              <h1 className="font-weight-light">
                <Link route="pro">
                  <a className="text-dark">PlateZero Pro</a>
                </Link>
              </h1>
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
                  color="primary"
                  block={true}
                  disabled={!this.signUpEnabled()}
                >
                  Create Account
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
      <>
        <Container
          className="pro"
          style={{
            height: '100vh',
            backgroundColor: 'rgba(213, 232, 208, 0.5)'
          }}
        >
          <Head>
            <title>Sign up for PlateZero Pro</title>
          </Head>
          <IfLoggedIn else={<RegisterForm />}>
            <h1 className="mt-3">You're good to go!</h1>
            <p>
              It looks like you are already logged into your PlateZero account.
              If you want to create a new account, you need to log out first.
            </p>
          </IfLoggedIn>
        </Container>
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
