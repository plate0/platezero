import React from 'react'
import { Layout, ProfileHeader, ProfileNav } from '../components'
import Head from 'next/head'

const user = {
  username: 'em',
  avatar: 'https://github.com/ethanmick.png?size=128'
}

const recipe = {
  name: 'pizza'
}

interface RecipeProps {
  recipe: any
  user: any
}

export default class Recipe extends React.Component<RecipeProps> {
  static async getInitialProps({ query }) {
    return { user, recipe }
  }

  public render() {
    return (
      <Layout>
        <Head>
          <title>{`${this.props.user.username} - ${
            this.props.recipe.name
          }`}</title>
        </Head>
        <ProfileHeader {...this.props.user} />
        <ProfileNav username={this.props.user.username} />
        <div>recipe for {this.props.recipe.name}</div>
      </Layout>
    )
  }
}
