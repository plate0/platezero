import React, { useState } from 'react'
import { Card, Container, Col, Row } from 'reactstrap'
import Head from 'next/head'
import { Link } from '../routes'
import Fade from 'react-reveal/Fade'
import { Footer } from '../components'

const CTA = () => (
  <Link route="pro-register">
    <a className="btn btn-primary btn-lg" role="button">
      Get Started Now
    </a>
  </Link>
)

const Header = ({}) => (
  <>
    <header>
      <Container>
        <nav className="p-3 text-center text-md-left">
          <Link route="/">
            <a>
              <img
                src="https://static.platezero.com/assets/logo/platezero-pro-black.png"
                alt="PlateZero Pro"
                style={{ width: 200 }}
              />
            </a>
          </Link>
        </nav>
        <Row className="hero">
          <Col
            className="text-center"
            xs={{ size: 12 }}
            md={{ size: 8, offset: 2 }}
          >
            <h1 style={{ fontSize: '2.2rem' }} className="mb-6">
              Hate Meal Planning?
            </h1>
            <h2 className="my-3">
              You should never worry about eating delicious, healthy food at
              home.
            </h2>
          </Col>
        </Row>
        <Row className="pt-1 pt-md-5">
          <Col className="justify-content-center d-flex">
            <h1>
              <span className="text-success">$50</span>/month
            </h1>
          </Col>
        </Row>
        <Row className="py-3">
          <Col className="d-flex justify-content-center">
            <CTA />
          </Col>
        </Row>
      </Container>
    </header>
    <style jsx global>
      {`
        .hero {
          text-align: center;
          padding-top: 18vh;
        }

        header {
          width: 100%;
          height: 85vh;
          background-size: cover;
          background-image: url('https://static.platezero.com/assets/cut_fruit_on_marble_optimized.jpg');
          background-position: center;
        }
      `}
    </style>
  </>
)

const Personalized = () => {
  const text = (
    <Fade bottom>
      <p className="lead mb-4">
        Your meal plan will be deeply personalized to your family's tastes. The
        plan will take into account meal preferences, loved food, disliked food,
        allergies, and more. When you sign up you fill out a food profile which
        lets PlateZero create the perfect plan.
      </p>
      <Row>
        <Col xs="6" className="d-flex align-items-center">
          <i className="fad fa-beer fa-3x" style={{ color: '#FFA000' }} />
          <div className="ml-2">Drinks can be added.</div>
        </Col>
        <Col xs="6" className="d-flex align-items-center">
          <span
            className="fa-stack"
            style={{ fontSize: '1.5rem', width: '100px !important' }}
          >
            <i
              className="fad fa-blender fa-stack-1x"
              style={{ color: '#5C6BC0' }}
            />
            <i
              className="fas fa-ban fa-stack-2x"
              style={{ color: '#D32F2F' }}
            />
          </span>
          <div className="ml-2">No special equipment required.</div>
        </Col>
      </Row>
    </Fade>
  )

  return (
    <Container>
      <Row className="py-6">
        <Col xs="12" md="6" className="py-6">
          <Fade bottom>
            <h2 className="mb-5">
              Every family is different,
              <br />
              so are your meals.
            </h2>
            <div className="d-none d-md-block">{text}</div>
          </Fade>
        </Col>
        <Col xs="12" md="6" className="mb-5">
          <Fade bottom>
            <img
              className="w-100 rounded shadow-sm"
              src="https://static.platezero.com/assets/family-dinner.jpg"
            />
          </Fade>
        </Col>
        <Col xs="12" className="d-block d-md-none">
          {text}
        </Col>
      </Row>
    </Container>
  )
}

const WeeklyPlans = () => {
  const text = (
    <Fade bottom>
      <p className="lead mb-4">
        On a choosen day each week, your meal plan for the following week is
        sent to you for review. You can make any change you want and view the
        full shopping list and estimated cost. You can easily add additional
        items to the list to be bought.
      </p>
      <Row>
        <Col xs="12" md="6" className="d-flex align-items-center">
          <i
            className="fad fa-calendar-day fa-3x"
            style={{ color: '#4CAF50' }}
          />
          <div className="ml-2">Schedule around your busy week.</div>
        </Col>
        <Col xs="12" md="6" className="d-flex align-items-center my-5 my-md-0">
          <i
            className="fad fa-clipboard-list-check fa-3x"
            style={{ color: '#2196F3' }}
          />
          <div className="ml-2">
            Add common household items to your list to get everything taken care
            of for you.
          </div>
        </Col>
      </Row>
    </Fade>
  )
  return (
    <div style={{ backgroundColor: '#fafafa' }}>
      <Container>
        <Row className="py-6">
          <Col xs="12" md={{ size: 6, order: 2 }}>
            <Fade bottom>
              <h2 className="mb-6">
                Your plan,
                <br />
                Once a week.
              </h2>
            </Fade>
            <div className="d-none d-md-block">{text}</div>
          </Col>
          <Col xs={{ size: 12 }} md={{ size: 6, order: 1 }} className="mb-5">
            <Fade bottom>
              <img
                className="w-100 rounded shadow-sm"
                src="https://static.platezero.com/assets/meal-plan.jpg"
              />
            </Fade>
          </Col>
          <Col xs="12" className="d-md-none">
            {text}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

const GroceryDelivery = () => {
  const text = (
    <Fade bottom>
      <p className="lead mb-4">
        You&rsquo;re busy and shopping can be a pain. PlateZero shops locally
        and delivers your food at a predetermined time so you can get back to
        eating well with no hassle.
      </p>
      <Row>
        <Col xs="6" className="d-flex align-items-center">
          <i
            className="fad fa-shopping-cart fa-3x"
            style={{ color: '#009688' }}
          />
          <div className="ml-2">We shop at your local grocery stores.</div>
        </Col>
        <Col xs="6" className="d-flex align-items-center">
          <i
            className="fad fa-credit-card fa-3x"
            style={{ color: '#283593' }}
          />
          <div className="ml-2">All fees included in your monthly price.</div>
        </Col>
      </Row>
    </Fade>
  )

  return (
    <Container>
      <Row className="py-6">
        <Col xs="12" md="6" className="py-6">
          <Fade bottom>
            <h2 className="mb-5">
              Groceries, <br />
              Delivered.
            </h2>
            <div className="d-none d-md-block">{text}</div>
          </Fade>
        </Col>
        <Col xs="12" md="6" className="mb-5">
          <Fade bottom>
            <img
              className="w-100 rounded shadow-sm"
              src="https://static.platezero.com/assets/grocery-shopping.jpg"
            />
          </Fade>
        </Col>
        <Col xs="12" className="d-block d-md-none">
          {text}
        </Col>
      </Row>
    </Container>
  )
}

export default class PlateZeroPro extends React.Component {
  public render() {
    return (
      <>
        <Head>
          <title>PlateZero Pro</title>
          <meta
            name="description"
            content="Eat delicious, healthy food at home with no hassle or stress. You tell us what you love, we do the rest."
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@platezer0" />
          <meta
            name="twitter:image:src"
            content="https://static.platezero.com/assets/cut_fruit_on_marble_optimized.jpg"
          />
          <meta property="og:title" content="PlateZero Pro" />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://static.platezero.com/assets/cut_fruit_on_marble_optimized.jpg"
          />
          <meta
            property="og:description"
            content="Eat delicious, healthy food at home with no hassle or stress. You tell us what you love, we do the rest."
          />
          <meta property="og:site_name" content="PlateZero" />
        </Head>
        <Header />
        <Personalized />
        <WeeklyPlans />
        <GroceryDelivery />
        <Container>
          <Row className="py-4">
            <Col xs="12" className="d-flex justify-content-center">
              <CTA />
            </Col>
          </Row>
        </Container>
        <Footer mobile={true} />
      </>
    )
  }
}
