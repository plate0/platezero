import React, { Component } from 'react'
import { Jumbotron, Button, Row, Col, Card, CardBody } from 'reactstrap'
import Head from 'next/head'
import '../style/index.scss'
import { Layout, ProfilePicture } from '../components'
import { api } from '../common/http'
import { UserJSON } from '../models/user'
import { Link } from '../routes'
import { getName } from '../common/model-helpers'

export default class Index extends Component<{ users: UserJSON[] }> {
  public static async getInitialProps() {
    try {
      return {
        users: await api.getUsers()
      }
    } catch {
      return { users: [] }
    }
  }

  public render() {
    return (
      <Layout>
        <Head>
          <title>
            PlateZero - Save, organize, and iterate on your favorite meals
          </title>
        </Head>
        <Jumbotron className="my-5">
          <h1 className="display-4">Welcome to PlateZero!</h1>
          <p className="lead">The best way to own the food you cook.</p>
          <p className="lead">
            Other sites show you recipes developed by others. PlateZero gives
            you the tools to save, organize, and remix your favorite meals.
          </p>
          <Link route="/register">
            <Button color="primary">Get started</Button>
          </Link>
        </Jumbotron>
        <Row>
          {this.props.users
            // TODO this is extremely hacky
            .filter(u => u.id < 5)
            .map(user => (
              <Col xs="12" md="6" key={user.id}>
                <Card className="mb-3">
                  <CardBody>
                    <Link route={`/${user.username}`}>
                      <a className="d-block">
                        <div className="d-flex align-items-center">
                          <div className="mr-3">
                            <ProfilePicture img={user.avatar_url} size={50} />
                          </div>
                          <div>
                            {getName(user)}
                            {user.name && (
                              <div className="text-muted">@{user.username}</div>
                            )}
                          </div>
                        </div>
                      </a>
                    </Link>
                  </CardBody>
                </Card>
              </Col>
            ))}
        </Row>
      </Layout>
    )
  }
}
