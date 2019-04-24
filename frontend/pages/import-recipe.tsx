import React from 'react'
import { Row, Col } from 'reactstrap'
import Head from 'next/head'
import { Layout } from '../components'
import * as _ from 'lodash'
import { Link } from '../routes'

const Source = [
  {
    text: 'Write it out',
    icon: 'pen',
    color: 'rgb(119, 192, 168)',
    link: '/recipes/new'
  },
  {
    text: 'From a website',
    icon: 'globe',
    color: 'rgb(58, 154, 217)',
    link: '/recipes/import/url'
  },
  {
    text: 'From a picture',
    icon: 'images',
    color: 'rgb(235, 113, 96)',
    link: '/recipes/import/file'
  },
  {
    text: 'From a PDF/Doc',
    icon: 'file-pdf',
    color: 'rgb(222, 77, 78)',
    link: '/recipes/import/file'
  },
  {
    text: 'Email it',
    icon: 'envelope',
    color: 'rgb(110, 158, 207)',
    link: 'mailto:importer@platezer.com'
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
          {Source.map((s, key) => (
            <Col xs="6" md="2" className="my-3" key={key}>
              <Link to={s.link}>
                <a>
                  <div
                    className="p-3 text-center d-flex align-items-center flex-column border rounded"
                    style={{
                      boxShadow: '0 0 5px rgba(0, 0, 0, 0.1) inset'
                    }}
                  >
                    <i
                      className={`write fal fa-${s.icon} fa-4x rounded
          `}
                      style={{ color: s.color }}
                    />
                    <div className="mt-2">{s.text}</div>
                  </div>
                </a>
              </Link>
            </Col>
          ))}
        </Row>
        <style jsx>
          {`
            .import {
              height: 200px;
              background-color: rgb(248, 249, 250);
              border: 1px solid rgb(222, 226, 230);
              border-radius: 0.25rem;
              align-items: center;
              justify-content: center;
              display: flex;
              flex-direction: column;
            }

            a {
              color: #212529;
            }

            a:hover {
              text-decoration: none;
            }
          `}
        </style>
      </Layout>
    )
  }
}
