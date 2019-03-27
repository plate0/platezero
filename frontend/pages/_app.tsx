import React from 'react'
import nextCookie from 'next-cookies'
import App, { Container } from 'next/app'
import '../style/index.scss'
import { UserJSON } from '../models/user'
import { UserContext } from '../context/UserContext'
import { TokenContext } from '../context/TokenContext'
import { getCurrentUser } from '../common/http'

const currentUser = async (token: string): Promise<UserJSON | undefined> => {
  try {
    return await getCurrentUser({ token })
  } catch (e) {
    console.error(e)
    return undefined
  }
}

interface MyAppProps {
  pageProps: any
  user?: UserJSON
  token?: string
}

interface MyAppState {
  user: UserJSON | undefined
}

export default class MyApp extends App<MyAppProps, MyAppState> {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}
    const { token } = nextCookie(ctx)
    return {
      token,
      pageProps,
      user: await currentUser(token)
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      user: this.props.user
    }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <UserContext.Provider value={this.state.user}>
        <TokenContext.Provider value={this.props.token}>
          <Container>
            <Component {...pageProps} />
          </Container>
        </TokenContext.Provider>
      </UserContext.Provider>
    )
  }
}
