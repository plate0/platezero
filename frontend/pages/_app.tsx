import React from 'react'
import nextCookie from 'next-cookies'
import App, { Container } from 'next/app'
import '../style/index.scss'
import { getCurrentUser } from '../common/http'
import { UserJSON } from '../models/user'

interface PlateZeroContextProviderProps {
  user?: UserJSON
}

export const PlateZeroContext = React.createContext<
  PlateZeroContextProviderProps
>({
  user: undefined
})

const currentUser = async (token: string): Promise<UserJSON | undefined> => {
  try {
    return await getCurrentUser({ token })
  } catch (e) {
    return undefined
  }
}

interface MyAppProps {
  pageProps: any
  user?: UserJSON
}

interface MyAppState {
  pzContext: PlateZeroContextProviderProps
}

export default class MyApp extends App<MyAppProps, MyAppState> {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}
    const { token } = nextCookie(ctx)
    return {
      pageProps,
      user: await currentUser(token)
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      pzContext: {
        user: this.props.user
      }
    }
  }

  render() {
    const { Component, pageProps } = this.props
    const ctx = this.state.pzContext
    return (
      <PlateZeroContext.Provider value={ctx}>
        <Container>
          <Component {...pageProps} />
        </Container>
      </PlateZeroContext.Provider>
    )
  }
}
