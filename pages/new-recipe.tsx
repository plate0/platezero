import Head from 'next/head'
import React from 'react'
import { Card, CardBody } from 'reactstrap'
import { Layout } from '../components'
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
  }
]

export default class ImportRecipe extends React.Component {
  public render() {
    return (
      <Layout>
        <Head>
          <title>Add a new Recipe</title>
        </Head>
        <h2 className="mt-4 text-center">Add a Recipe</h2>
        <p className="lead text-center">Where will your recipe come from?</p>
        <div className="mb-3 d-flex justify-content-center align-items-center flex-wrap">
          {links.map((s, key) => (
            <Card
              key={key}
              className="m-2"
              style={{
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.1) inset',
                minWidth: 150
              }}
            >
              <CardBody className="text-center d-relative">
                <div className="mb-3">
                  <i
                    className={`fal fa-fw fa-${s.icon} fa-4x`}
                    style={{ color: s.color }}
                  />
                </div>
                <div>
                  <Link to={s.route}>
                    <a className="text-dark stretched-link">{s.text}</a>
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </Layout>
    )
  }
}
