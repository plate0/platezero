import React from 'react'

export default class User extends React.Component {
  static async getInitialProps({ query }) {
    console.log('query', query)
    return query
  }

  render() {
    console.log('render', this.props)
    return <div>USER PAGE</div>
  }
}
