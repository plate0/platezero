import * as React from 'react'
import * as _ from 'lodash'
import ErrorPage from './_error'
import Head from 'next/head'
import { Blankslate, Layout } from '../components'
import { Row, Col } from 'reactstrap'
import { api } from '../common/http'
import { UserJSON, PlannedRecipeJSON } from '../models'
import { Link } from '../routes'

interface MealplanProps {
  user?: UserJSON
  plans?: PlannedRecipeJSON[]
  statusCode?: number
}

class Mealplan extends React.Component<MealplanProps> {
  constructor(props: MealplanProps) {
    super(props)
  }

  static async getInitialProps({ query, res }): Promise<MealplanProps> {
    try {
      const user = await api.getCurrentUser()
      const plans = await api.getPlannedRecipes()
      return { user, plans }
    } catch (err) {
      const statusCode = err.statusCode || 500
      if (res) {
        res.statusCode = statusCode
      }
      return { statusCode }
    }
  }

  public render() {
    const { statusCode } = this.props
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />
    }
    const { user, plans } = this.props
    return (
      <Layout title="Meal Plan">
        <Head>
          <title>Meal Plan - PlateZero</title>
        </Head>
        {plans.length === 0 && (
          <Row className="mt-3">
            <Col xs="12">
              <Blankslate>
                <h2>No Planned Meals</h2>
                <Link to={`/${user.username}`}>
                  <a className="btn btn-primary">Browse Recipes</a>
                </Link>
              </Blankslate>
            </Col>
          </Row>
        )}
        {plans.length > 0 && (
          <Row className="mt-3">
            <Col xs="12">
              <pre>{JSON.stringify(plans)}</pre>
            </Col>
          </Row>
        )}
      </Layout>
    )
  }
}

export default Mealplan
