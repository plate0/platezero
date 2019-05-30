import React from 'react'
import Router from 'next/router'
import App, { Container } from 'next/app'
import '../style/index.scss'
import { UserJSON } from '../models/user'
import { UserContext } from '../context/UserContext'
import { api } from '../common/http'

const currentUser = async (): Promise<UserJSON | undefined> => {
  try {
    return await api.getCurrentUser()
  } catch (e) {
    return undefined
  }
}

interface AppProps {
  user?: UserJSON
  pageProps: any
}

interface AppState {
  updateUser: any
  user?: UserJSON
}

export default class PlateZeroApp extends App<AppProps, AppState> {
  static async getInitialProps({ Component, ctx }) {
    api.loadAuth(ctx)
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}
    return {
      user: ctx.req ? await currentUser() : undefined,
      pageProps
    }
  }

  constructor(props: any) {
    super(props)
    this.updateUser = this.updateUser.bind(this)
    this.state = { user: props.user, updateUser: this.updateUser }
  }

  public async componentDidMount() {
    api.loadAuth()
    // This is really only used in dev, when the pages soft-refreshes
    // and we lose the current state.
    if (!this.state.user) {
      this.setState({
        user: await currentUser()
      })
    }
    Router.events.on('routeChangeStart', url => {
      const w = window as any
      if (w && w._paq) {
        w._paq.push(['setCustomUrl', url])
        if (this.state.user) {
          w._paq.push(['setUserId', this.state.user.username])
        }
        w._paq.push(['trackPageView'])
      }
    })
  }

  public updateUser = (user: UserJSON) => this.setState({ user })

  public render() {
    const { Component, pageProps } = this.props
    return (
      <UserContext.Provider value={this.state as any}>
        <Container>
          <Component {...pageProps} />
        </Container>
      </UserContext.Provider>
    )
  }
}
