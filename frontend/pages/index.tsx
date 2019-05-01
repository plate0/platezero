import React, { Component, useContext, useState } from 'react'
import {
  Jumbotron,
  Container,
  Button,
  Row,
  Col,
  Card,
  CardBody,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  NavItem,
  NavLink,
  Collapse,
  Nav
} from 'reactstrap'
import Head from 'next/head'
import '../style/index.scss'
import { Layout, ProfilePicture } from '../components'
import { api } from '../common/http'
import { UserJSON } from '../models/user'
import { Link } from '../routes'
import { getName } from '../common/model-helpers'
import { UserContext } from '../context/UserContext'
import { Footer } from '../components/Footer'

const HomeNav = () => {
  const { user } = useContext(UserContext)
  const [isOpen, setOpen] = useState(false)
  return (
    <Navbar
      expand="md"
      className="px-0 px-md-3 position-absolute w-100"
      style={{ top: 0, left: 0 }}
    >
      <div className="position-absolute w-100 d-flex">
        <NavbarBrand href="/" className="mx-auto text-dark d-sm-none">
          PlateZero
        </NavbarBrand>
      </div>
      <NavbarToggler
        onClick={() => setOpen(!isOpen)}
        className="ml-auto"
        style={{ zIndex: 1 }}
      >
        <i className="far fa-bars" />
      </NavbarToggler>
      <Collapse isOpen={isOpen} navbar style={{ zIndex: 1 }}>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Link to="login">
              <a className="nav-link text-dark">
                Login <i className="fal fa-sign-in" />
              </a>
            </Link>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  )
}

export default class Index extends Component {
  public render() {
    return (
      <div>
        <Head>
          <title>PlateZero - Save, Remix & Share your Favorite Recipes</title>
        </Head>
        <div className="hero-image position-relative w-100 d-flex align-items-center">
          <HomeNav />
          <Row className="w-100 mx-0">
            <Col
              xs={{ offset: 4, size: 8 }}
              sm={{ offset: 5, size: 7 }}
              md={{ offset: 6, size: 6 }}
              lg={{ offset: 6, size: 5 }}
              xl={{ offset: 6, size: 3 }}
            >
              <h1 className="d-none d-sm-block">PlateZero</h1>
              <h2>Save, Remix, and Share your favorite recipes</h2>
              <Button color="primary">Join the Beta</Button>
            </Col>
          </Row>
        </div>
        <Container>
          <Row className="my-5">
            <Col xs="12" className="text-center">
              <img
                className="w-100 mb-3"
                src="https://s3.amazonaws.com/com-platezero-static/assets/devices.jpg"
              />
              <h2>All your recipes in one place, easily searchable.</h2>
              <p className="lead">
                It works beautifully on mobile devices and computers.
              </p>
            </Col>
          </Row>
        </Container>
        <div className="bg-light">
          <Container>
            <Row className="py-4">
              <Col xs="12" md="6">
                <img
                  className="w-100 rounded shadow-sm"
                  src="https://static.platezero.com/assets/record-player.jpg"
                />
              </Col>
              <Col xs="12" md="6" className="align-self-center">
                <h2>Remix recipes to perfect them as you go.</h2>
                <p className="lead">
                  Always know where you started with your history tab. Your
                  recipes are special because you make them. You tweak them,
                  make them again, and perfect the dish. The journey is as
                  important as the amazing meal in front of you, and PlateZero
                  captures that rich history.
                </p>
              </Col>
            </Row>
          </Container>
        </div>
        <Container>
          <Row>
            <Col xs="12" md={{ size: 6, order: 12 }}>
              <img
                className="w-100 rounded shadow-sm"
                src="https://static.platezero.com/assets/cutting-board-food-prep.jpg"
              />
            </Col>
            <Col xs="12" md="6">
              <h2>Share your recipes</h2>
              <p>
                Share recipes easily with friends and family, so they can try
                out their favorites on their own
              </p>
              <p>Sharing is as easy as sending a link to the recipe!</p>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <h3>And lots of great other things</h3>
              <ul>
                <li>
                  Customize descirptions, pictures, everythting about the
                  recipe, no matter where it came from.
                </li>
                <li>Search your, and friends, recipes</li>
                <li>Add notes</li>
                <li>
                  {' '}
                  add your recipes from any source (Maybe this is a bigger point
                  to make)
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
        <div style={{ backgroundColor: 'mistyrose' }}>
          <Container>
            <Row className="py-4">
              <Col xs="12">
                <blockquote className="blockquote">
                  <p>Hi 👋,</p>
                  <p>
                    We made PlateZero since we were frustrated about not having
                    a good place to keep our favorite dishes. It needed to be
                    source agnostic, store recipes in a consistent format.
                  </p>
                  <footer className="blockquote-footer">
                    Ben, Ethan, Katie{' '}
                    <cite title="Source Title">PlateZero Cofounders</cite>
                  </footer>
                </blockquote>
              </Col>
            </Row>
          </Container>
        </div>
        <Footer />
        <style jsx>{`
          .hero-image {
            height: 80vh;
            background-image: url(https://static.platezero.com/assets/fruit-cuttings-bright.jpg);
            background-repeat: no-repeat;
            background-position-y: 50%;
            background-size: cover;
          }
        `}</style>
      </div>
    )
  }
}
