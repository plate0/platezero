import React, { Component } from 'react'
import { Jumbotron, Button, Card, CardBody, CardColumns } from 'reactstrap'
import Head from 'next/head'
import '../style/index.scss'
import { Layout, UserCard } from '../components'
import { getUsers } from '../common/http'
import { UserJSON } from '../models/user'
import { Link } from '../routes'

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
        <CardColumns className="pb-5">
          {this.props.users.map(user => (
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
