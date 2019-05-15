import React from 'react'
import { Row, Col } from 'reactstrap'
import Head from 'next/head'
import { Layout } from '../components'
import * as _ from 'lodash'
import { Link } from '../routes'

const links = [
  {
    text: 'Write it out',
    icon: 'pen',
    color: 'rgb(119, 192, 168)',
    route: 'new-recipe-text'
  },
  {
    text: 'From a website',
    icon: 'globe',
    color: 'rgb(58, 154, 217)',
    route: 'new-recipe-url'
  },
  {
    text: 'From a picture',
    icon: 'images',
    color: 'rgb(235, 113, 96)',
    route: 'new-recipe-file',
    params: { type: 'image' }
  },
  {
    text: 'From a PDF/Doc',
    icon: 'file-pdf',
    color: 'rgb(222, 77, 78)',
    route: 'new-recipe-file',
    params: { type: 'doc' }
  },
  {
    text: 'Email it',
    icon: 'envelope',
    color: 'rgb(110, 158, 207)',
    route: 'mailto:importer@platezero.com'
  }
]

export default class ImportRecipe extends React.Component {
  public render() {
    return (
      <Layout>
        <Head>
          <title>Add a new Recipe</title>
        </Head>
        <Row className="mt-5 mb-3">
          <Col xs="12">
            <h2 className="mb-0">Add a new Recipe</h2>
            <p className="text-muted">
              You can easily add a recipe in several ways.
            </p>
          </Col>
        </Row>
        <Row>
          {links.map((s, key) => (
            <Col xs="6" md="2" className="my-3" key={key}>
              <Link to={s.route} params={s.params}>
                <a className="import">
                  <div
                    className="p-3 text-center d-flex align-items-center flex-column border rounded"
                    style={{
                      boxShadow: '0 0 5px rgba(0, 0, 0, 0.1) inset'
                    }}
                  >
                    <i
                      className={`write fal fa-${s.icon} fa-4x rounded`}
                      style={{ color: s.color }}
                    />
                    <div className="mt-2">{s.text}</div>
                  </div>
                </a>
              </Link>
            </Col>
          ))}
        </Row>
        <Row className="justify-content-center">
          <Col xs="10" md="6" className="text-center">
            <p className="text-muted">
              Want to add recipes from somewhere else? A cookbook, or many
              URL&#39;s? <a href="mailto:hello@platezero.com">Contact Us</a> for
              help.
            </p>
          </Col>
        </Row>
        <style jsx>
          {`
            a.import {
              color: #212529;
            }

            a.import:hover {
              text-decoration: none;
            }
          `}
        </style>
      </Layout>
    )
  }
}
