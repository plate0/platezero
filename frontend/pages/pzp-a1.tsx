import React, { useState } from 'react'
import { Card, Container, Col, Row } from 'reactstrap'
import Head from 'next/head'
import { Link } from '../routes'

const Mailchimp = () => {
  const [email, setEmail] = useState('')
  const onSubmit = () => {
    fbq('track', 'Lead')
    setEmail('')
  }

  return (
    <>
      <div id="mc_embed_signup">
        <form
          onSubmit={onSubmit}
          action="https://virtyx.us14.list-manage.com/subscribe/post?u=d18eecd2a37d39601d53b3c72&amp;id=7cde665dd7"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          target="_blank"
          value={email}
          onChange={e => setEmail(e.target.value)}
          noValidate
        >
          <div className="input-group">
            <input
              type="email"
              name="EMAIL"
              className="email form-control"
              id="mce-EMAIL"
              placeholder="email address"
              required
            />
            <div className="input-group-append">
              <input
                type="submit"
                value="Join Wait List"
                name="subscribe"
                id="mc-embedded-subscribe"
                className="btn btn-primary"
                disabled={email == ''}
              />
            </div>
            <div
              style={{ position: 'absolute', left: -5000 }}
              aria-hidden="true"
            >
              <input
                type="text"
                name="b_d18eecd2a37d39601d53b3c72_7cde665dd7"
                tabIndex="-1"
              />
            </div>
          </div>
          <div id="mce-responses" className="text-center font-weight-bold">
            <div id="mce-error-response" style={{ display: 'none' }}></div>
            <div id="mce-success-response" style={{ display: 'none' }}></div>
          </div>
        </form>
      </div>
      <script src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]='EMAIL';ftypes[0]='email';fnames[1]='FNAME';ftypes[1]='text';fnames[2]='LNAME';ftypes[2]='text';fnames[3]='ADDRESS';ftypes[3]='address';fnames[4]='PHONE';ftypes[4]='phone';}(jQuery));var $mcj = jQuery.noConflict(true);
`
        }}
      />
      <style jsx>
        {`
          #mce-error-response {
            font-size: 20px;
          }

          #mce-success-response {
            font-size: 30px;
          }
        `}
      </style>
    </>
  )
}

const Header = ({}) => (
  <>
    <header>
      <Container>
        <nav className="p-3">
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
        <div className="py-0 py-md-4" />
        <Row className="hero pt-3 pt-md-6">
          <Col
            className="text-center"
            xs={{ size: 12 }}
            md={{ size: 8, offset: 2 }}
          >
            <h1>Hate Meal Planning?</h1>
            <h2 className="mb-3">
              You should never worry about eating delicious, healthy food at
              home. Curious? Join our wait list!
            </h2>
          </Col>
        </Row>
        <Row>
          <Col xs={{ offset: 1, size: 10 }} md={{ offset: 3, size: 6 }}>
            <Mailchimp />
          </Col>
        </Row>
        <Row className="pt-3 pt-md-5">
          <Col className="justify-content-center d-flex">
            <h1>
              <span className="text-success">$50</span>/month
            </h1>
          </Col>
        </Row>
        <div className="row headlines justify-content-around pt-0 pt-md-5">
          <Col xs="10" md="4">
            <Card
              className="mt-3 mt-md-0 p-3 shadow-sm border-0"
              style={{ height: 180 }}
            >
              <h3>Personalization</h3>
              <p>
                Tell us your preferences about what foods you love, like, or
                dislike. Inform us of allergies and other personal preferences.
              </p>
            </Card>
          </Col>
          <Col xs="10" md="4">
            <Card
              className="mt-3 mt-md-0 p-3 shadow-sm border-0"
              style={{ height: 180 }}
            >
              <h3>Weekly Meal Plans</h3>
              <p>
                We create weekly meal plans with a complete shopping list, to
                which you can add additional items to that you normally get at
                the store.
              </p>
            </Card>
          </Col>
          <Col xs="10" md="4">
            <Card
              className="mt-3 mt-md-0 p-3 border-0 shadow-sm"
              style={{ height: 180 }}
            >
              <h3>
                Grocery Delivery
                <span
                  className="ml-1 text-secondary"
                  style={{
                    verticalAlign: 'super',
                    fontSize: 18
                  }}
                >
                  *
                </span>
              </h3>
              <p>
                We shop locally at your favorite stores to get the best fresh
                ingredients, which are delivered to your door.
              </p>
              <small className="text-secondary">* Where available</small>
            </Card>
          </Col>
        </div>
        <ul
          className="mt-3 list-unstyled text-center"
          style={{ fontSize: '1.5rem' }}
        >
          <li>
            <i className="text-success far fa-check" />7 days a week
          </li>
          <li>
            <i className="text-success far fa-check" />
            Breakfast, Lunch, and Dinner
          </li>
        </ul>
      </Container>
    </header>
    <style jsx>
      {`
        nav {
          font-size: 1.5rem;
        }

        .hero {
          text-align: center;
        }

        .hero h1 {
          font-size: 3rem;
        }

        .headlines > div {
          background-color: rgba(0, 0, 0, 0.5);
          font-size: 1.5rem;
          padding: 2rem;
          text-align: center;
          color: white;
          border-radius: 0.25rem;
        }

        ul {
          font-size: 20px;
          line-height: 2rem;
        }

        header {
          height: 1000px;
          width: 100%;
          background-size: cover;
          background-image: url('https://static.platezero.com/assets/cutting-board-with-knife.jpg');
          background-position: center;
        }
      `}
    </style>
  </>
)

export default class PZPA1 extends React.Component {
  public render() {
    return (
      <>
        <Head>
          <title>PlateZero Pro</title>
        </Head>
        <Header />
      </>
    )
  }
}
