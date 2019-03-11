import React from 'react'
import Head from 'next/head'
import { Layout } from '../components'
import { PlateZeroContext } from '../pages/_app'

export default class ImportRecipe extends React.Component {
  public static contextType = PlateZeroContext
  public render() {
    // const { user } = this.context
    return (
      <Layout>
        <Head>
          <title>Import Recipe</title>
        </Head>
        <div>import</div>
      </Layout>
    )
  }
}
