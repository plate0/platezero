import React from 'react'
import { PlateZeroContext } from '../pages/_app'

interface IfLoggedInProps {
  username?: string
}

export class IfLoggedIn extends React.Component<IfLoggedInProps> {
  public static contextType = PlateZeroContext

  public render() {
    // if a username is provided and matches the currently logged in user
    if (this.props.username) {
      return this.context.user.username === this.props.username
        ? this.props.children
        : null
    }

    // if a user is logged in
    if (this.context.user) {
      return this.props.children
    }

    // by default, render nothing
    return null
  }
}
