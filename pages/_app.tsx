import App, { Container } from 'next/app'
import Router from 'next/router'
import React from 'react'
import { api } from '../common/http'
import { UserContext } from '../context/UserContext'
import { UserJSON } from '../models/user'
import '../style/index.scss'

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
    if (!(this.state as any).user) {
      this.setState({
        user: await currentUser()
      })
    }

    // scrolls holds the scroll position we saved before navigating for each
    // page
    const scrolls = {}

    // nextScroll is the saved location we should jump back to when the route
    // change is complete.
    let nextScroll = undefined

    Router.beforePopState((url) => {
      const prevPosition = scrolls[url.as]
      if (prevPosition) {
        nextScroll = prevPosition
      }
      return true
    })

    Router.events.on('routeChangeComplete', () => {
      if (nextScroll) {
        window.scrollTo(nextScroll.x, nextScroll.y)
        nextScroll = undefined
      }
    })

    Router.events.on('routeChangeStart', () => {
      // if the user has scrolled, add their current position to the map so we
      // can return them here when they navigate back/forward.
      if (window.scrollX !== 0 || window.scrollY !== 0) {
        scrolls[window.location.href] = { x: window.scrollX, y: window.scrollY }
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
