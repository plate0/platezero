import React, { Component } from 'react'
import {
  Jumbotron,
  Button,
  Card,
  CardBody,
  CardColumns
} from 'reactstrap'
import Head from 'next/head'
import * as _ from 'lodash'
import '../style/index.scss'
import { Layout, ProfilePicture } from '../components'
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
          <title>PlateZero - Adapt, remix, and iterate on your favorite meals</title>
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
            <UserCard key={user.id} user={user} />
          ))}
        </CardColumns>
      </Layout>
    )
  }
}

const UserCard = (props: { user: UserJSON }) => {
  const route = `/${props.user.username}`
  return (
    <Card>
      <CardBody>
        <Link route={route}>
          <a className="d-block">
            <div className="d-flex align-items-center">
              <div className="mr-3">
                <ProfilePicture img={props.user.avatar_url} size={50} />
              </div>
              <div>
                {props.user.name ? props.user.name : props.user.username}
                {props.user.name && (
                  <div className="text-muted">@{props.user.username}</div>
                )}
              </div>
            </div>
          </a>
        </Link>
      </CardBody>
    </Card>
  )
}
