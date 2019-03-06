import React, { Component } from 'react'
import { Jumbotron, Button, Card, CardBody, CardColumns } from 'reactstrap'
import Head from 'next/head'
import * as _ from 'lodash'
import '../style/index.scss'
import { Layout, UserCard } from '../components'
import { getUsers } from '../common/http'
import { UserJSON } from '../models/user'
const {
  routes: { Link }
} = require('../routes')

export default class Index extends Component<{ users: UserJSON[] }> {
  public static async getInitialProps() {
    return {
      users: await getUsers()
    }
  }

  public render() {
    return (
      <Layout>
        <Head>
          <title>
            PlateZero - Adapt, remix, and iterate on your favorite meals
          </title>
        </Head>
        <Jumbotron className="my-5">
          <h1 className="display-4">Welcome to PlateZero!</h1>
          <p className="lead">
            The best way to make the food you cook your own.
          </p>
          <p className="lead">
            Other sites show you recipes made by others. PlateZero gives you the
            tools to adapt, remix, and iterate over your favorite meals.
          </p>
          <Link route="/register">
            <Button color="primary">Get started for free</Button>
          </Link>
        </Jumbotron>
        <CardColumns>
          {_.shuffle(this.props.users).map(user => (
            <Card key={user.id}>
              <CardBody>
                <UserCard user={user} />
              </CardBody>
            </Card>
          ))}
        </CardColumns>
      </Layout>
    )
  }
}
