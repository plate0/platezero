import React from 'react'
import { get } from 'lodash'
import { PlateZeroContext } from '../pages/_app'

interface IfLoggedInProps {
  username?: string
  else?: any
}

export class IfLoggedIn extends React.Component<IfLoggedInProps> {
  public static contextType = PlateZeroContext
  private guarded: any
  private default: any

  constructor(props: IfLoggedInProps) {
    super(props)
    this.guarded = this.props.children
    this.default = this.props.else || null
  }

  public render() {
    // if a username is provided and matches the currently logged in user
    if (this.props.username) {
      return get(this.context, 'user.username') === this.props.username
        ? this.guarded
        : this.default
    }

    // if a user is logged in
    if (this.context.user) {
      return this.guarded
    }

    // by default, render nothing
    return this.default
  }
}
