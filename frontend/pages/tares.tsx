import React from 'react'
import { Layout, ProfileHeader, ProfileNav } from '../components'
import Head from 'next/head'

interface TaresProps {
  user: any
}

const user = {
  username: 'em',
  avatar: 'https://github.com/ethanmick.png?size=128'
}

export default class Tares extends React.Component<TaresProps> {
  static async getInitialProps({ query }) {
    return { user }
  }

  public render() {
    return (
      <Layout>
        <Head>
          <title>{`${this.props.user.username} - Tares`}</title>
        </Head>
        <ProfileHeader {...user} />
        <ProfileNav username={this.props.user.username} />
        <div>Tares!!</div>
      </Layout>
    )
  }
}
