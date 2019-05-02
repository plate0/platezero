import React from 'react'
import { Row, Col } from 'reactstrap'
import Head from 'next/head'
import ErrorPage from './_error'
import { Layout, RecipePreview, UserSidebar } from '../components'
import { UserJSON } from '../models'
import { api } from '../common/http'
import { getName } from '../common/model-helpers'

interface UserProps {
  user?: UserJSON
  statusCode?: number
}

export default class User extends React.Component<UserProps> {
  static async getInitialProps({ query, res }) {
    try {
      const { username } = query
      return {
        user: await api.getUser(username)
      }
    } catch (err) {
      const statusCode = err.statusCode || 500
      if (res) {
        res.statusCode = statusCode
      }
      return { statusCode }
    }
  }

  public render() {
    const { user, statusCode } = this.props
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />
    }
    return (
      <Layout>
        <Head>
          <title>{getName(user)} on PlateZero</title>
        </Head>
        <Row className="mt-3">
          <Col xs={12} sm={4} md={3} lg={2} className="mr-3 mb-3">
            <UserSidebar user={user} />
          </Col>
          <Col>
            <RecipePreview recipes={user.recipes} user={user} />
          </Col>
        </Row>
      </Layout>
    )
  }
}
