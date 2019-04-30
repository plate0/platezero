import React, { Component } from 'react'
import {
  Jumbotron,
  Container,
  Button,
  Row,
  Col,
  Card,
  CardBody
} from 'reactstrap'
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
      <Layout fluid className="px-0">
        <Head>
          <title>PlateZero - Save, Remix & Share your Favorite Recipes</title>
        </Head>
        <div
          className="w-100 d-flex align-items-center justify-content-center flex-column"
          style={{
            height: 500,
            objectFit: 'cover',
            backgroundImage:
              'url(https://static.platezero.com/assets/clean-white-table-ingredients.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        >
          <h1
            style={{
              textShadow: '0 1px 0 black',
              color: 'white',
              fontSize: '4rem'
            }}
          >
            PlateZero
          </h1>
          <h2
            style={{
              textShadow: '0 1px 0 black',
              color: 'white'
            }}
          >
            Save, Remix & Share your favorite recipes
          </h2>
        </div>
        <Container>
          <Row className="my-3">
            <Col xs="12">
              Finally all of your recipes in one place and easily searchable
            </Col>
          </Row>
          <Row>
            <Col xs="12" md="6">
              <img
                className="w-100"
                src="https://static.platezero.com/assets/record-player.jpg"
              />
            </Col>
            <Col xs="12" md="6">
              <div>Remix recipes to perfect them as you go.</div>
              <div>Always know where you started with your history tab</div>
            </Col>
          </Row>
          <Row>
            <Col xs="12" md={{ size: 6, order: 12 }}>
              <img
                className="w-100"
                src="https://static.platezero.com/assets/cutting-board-food-prep.jpg"
              />
            </Col>
            <Col xs="12" md="6">
              <div>
                Share recipes easily with friends and family, so they can try
                out their favorites on their own
              </div>
            </Col>
          </Row>
        </Container>
      </Layout>
    )
  }
}
