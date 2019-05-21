import React from 'react'
import { Card, CardBody } from 'reactstrap'
import Head from 'next/head'
import { Layout } from '../components'
import * as _ from 'lodash'
import { Link } from '../routes'

const links = [
  {
    text: 'By Hand',
    icon: 'pen',
    color: 'rgb(119, 192, 168)',
    route: 'new-recipe-text'
  },
  {
    text: 'Website',
    icon: 'globe',
    color: 'rgb(58, 154, 217)',
    route: 'new-recipe-url'
  },
  {
    text: 'Photo',
    icon: 'images',
    color: 'rgb(235, 113, 96)',
    route: 'new-recipe-file',
    params: { type: 'image' }
  },
  {
    text: 'PDF/Doc',
    icon: 'file-pdf',
    color: 'rgb(222, 77, 78)',
    route: 'new-recipe-file',
    params: { type: 'doc' }
  },
  {
    text: 'Email',
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
        <h2 className="mt-5 text-center">Add a Recipe</h2>
        <p className="lead text-center">Where will your recipe come from?</p>
        <div className="mb-3 d-flex justify-content-center align-items-center flex-wrap">
          {links.map((s, key) => (
            <Card
              key={key}
              className="m-2"
              style={{ boxShadow: '0 0 5px rgba(0, 0, 0, 0.1) inset' }}
            >
              <CardBody className="text-center d-relative">
                <div className="mb-3">
                  <i
                    className={`fal fa-fw fa-${s.icon} fa-4x`}
                    style={{ color: s.color }}
                  />
                </div>
                <div>
                  <Link to={s.route} params={s.params}>
                    <a className="text-dark stretched-link">{s.text}</a>
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
        <p className="mx-5 text-muted text-center">
          Want to add recipes from somewhere else, like an entire cookbook or
          many URLs? <a href="mailto:hello@platezero.com">Contact us</a> for
          help.
        </p>
      </Layout>
    )
  }
}
