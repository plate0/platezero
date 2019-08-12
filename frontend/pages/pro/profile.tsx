import React from 'react'

export default class ProProfile extends React.Component<
  ProProfileProps,
  ProProfileState
> {
  public render() {
    const { user, statusCode } = this.props
    const { isSaving, editErrors, avatarErrors } = this.state
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />
    }
    const name = getName(user)
    return <></>
  }
}
