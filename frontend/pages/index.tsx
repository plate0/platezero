import React, { Component, useContext } from 'react'
import {
  Container,
  Row,
  Col,
  Navbar,
  NavbarBrand,
  NavItem,
  Nav
} from 'reactstrap'
import Head from 'next/head'
import '../style/index.scss'
import { ProfilePicture } from '../components'
import { Link } from '../routes'
import { UserContext } from '../context/UserContext'
import { Footer } from '../components/Footer'

const HomeNav = () => {
  const { user } = useContext(UserContext)
  const action = user ? (
    <Link route={`/${user.username}`}>
      <a className="d-block py-1 px-2">
        <ProfilePicture img={user.avatar_url} size={30} />
      </a>
    </Link>
  ) : (
    <Link to="login">
      <a className="nav-link text-dark">
        Login <i className="fal fa-sign-in" />
      </a>
    </Link>
  )
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
      <div className="ml-auto mr-2" style={{ zIndex: 1 }}>
        <Nav navbar>
          <NavItem>{action}</NavItem>
        </Nav>
      </div>
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
              <Link to="register">
                <a className="btn btn-primary btn-lg" role="button">
                  Join the Beta
                </a>
              </Link>
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
              <h2 className="mt-5">
                All your recipes in one place, easily searchable.
              </h2>
              <p className="lead">
                It works beautifully on phones and computers.
              </p>
            </Col>
          </Row>
        </Container>
        <div className="bg-light">
          <Container>
            <Row className="py-5">
              <Col xs="12" md="6">
                <img
                  className="w-100 rounded shadow-sm"
                  src="https://static.platezero.com/assets/avocado.jpg"
                />
              </Col>
              <Col
                xs="12"
                md="6"
                className="align-self-center text-center text-md-left"
              >
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
          <Row className="py-5">
            <Col xs="12" md={{ size: 6, order: 12 }} className="text-center">
              <img
                className="w-75"
                src="https://s3.amazonaws.com/com-platezero-static/assets/sprinkles.jpg"
              />
            </Col>
            <Col
              xs="12"
              md="6"
              className="align-self-center text-center text-md-right"
            >
              <h2>Share your recipes</h2>
              <p className="lead">
                Share recipes easily with friends and family, so they can try
                out their favorites on their own!
              </p>
            </Col>
          </Row>
        </Container>
        <div style={{ backgroundColor: '#3ae8b050' }}>
          <Container>
            <Row className="py-6">
              <Col xs="12">
                <blockquote className="blockquote">
                  <p>Hi 👋,</p>
                  <p>
                    We made PlateZero since we were frustrated about not having
                    a great place to keep our favorite recipes. It needed to be
                    available everywhere. It had to show our recipes in a
                    consistent format. And we needed to be able to add recipes
                    from <em>any</em> source. PlateZero is our home for all our
                    recipes, and we hope it becomes your home too!
                  </p>
                  <footer className="blockquote-footer text-right">
                    Ben, Ethan, Katie
                  </footer>
                </blockquote>
              </Col>
            </Row>
          </Container>
        </div>
        <Container>
          <Row className="py-5">
            <Col xs="12" md={{ offset: 3, size: 6 }} className="text-center">
              <h3>And lots of great other things</h3>
              <ul className="list-unstyled">
                <li>Change everything about the recipes.</li>
                <li>
                  Search your recipes to quickly find what you're looking for.
                </li>
                <li>
                  Easily add your recipes from anywhere. Websites, documents, or
                  pictures.
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
        <div style={{ backgroundColor: 'ocean' }}>
          <Container>
            <Row className="py-5">
              <Col className="d-flex justify-content-center align-items-center">
                <Link to="register">
                  <a className="btn btn-primary btn-lg" role="button">
                    Join the Beta
                  </a>
                </Link>
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
