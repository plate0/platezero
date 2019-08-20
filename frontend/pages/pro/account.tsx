import React from 'react'
import {
  Alert,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  Container,
  Col,
  Row
} from 'reactstrap'
import { Elements } from 'react-stripe-elements'
import { api } from '../../common/http'
import { Link } from '../../routes'
import { redirect } from '../../common/redirect'
import { PaymentForm } from '../../components/pro'
import { UserJSON, FamilyJSON } from '../../models'
import { first, filter } from 'lodash'

interface AccountProps {
  family: FamilyJSON
  user: UserJSON
  billing?: UserProfileQuestion
  payment?: any
}

interface AccountState {
  error?: string
}

export default class ProAccount extends React.Component<
  AccountProps,
  AccountState
> {
  constructor(props: AccountProps) {
    super(props)
    this.state = {}
    this.onSuccess = this.onSuccess.bind(this)
    this.onError = this.onError.bind(this)
  }

  static async getInitialProps({ res }) {
    try {
      const user = await api.getCurrentUser()
      if (!user) {
        return redirect(res, ProLogin)
      }
      const family = await api.getProFamily()
      const billing = first(filter(family.profile, { type: 'Billing' }))
      let payment = undefined
      try {
        payment =
          billing && billing.answer ? JSON.parse(billing.answer) : undefined
      } catch (err) {}
      return {
        family,
        user,
        payment,
        billing
      }
    } catch (err) {
      return redirect(res, ProLogin)
    }
  }

  public componentDidMount() {
    if (document) {
      document.body.className += ' ' + 'bg-light'
    }
  }

  public componentWillUnmount() {
    document.body.className = ''
  }

  public async onSuccess(res: any) {
    const answer = JSON.stringify(res.token.card)
    const {
      billing: { id: question_id }
    } = this.props
    const {
      family: { id: family_id }
    } = this.props
    try {
      const res = await api.putAnswer({ family_id, question_id, answer })
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  public onError(err: Error) {
    this.setState({ error: err.message })
  }

  public render() {
    const { payment } = this.props
    return (
      <div>
        <Container>
          <nav className="py-3 text-center text-md-left">
            <Link route="/">
              <a>
                <img
                  src="https://static.platezero.com/assets/logo/platezero-pro-black.png"
                  alt="PlateZero Pro"
                  style={{ width: 150 }}
                />
              </a>
            </Link>
          </nav>
          <Row>
            <Col xs={{ offset: 2, size: 8 }} className="bg-white">
              <Row className="my-4">
                <Col>
                  <Link route="pro-profile">
                    <a className="text-dark">
                      <h5 className="mb-0 font-weight-light">
                        <i className="far fa-chevron-left mr-2" />
                        Back to Profile
                      </h5>
                    </a>
                  </Link>
                </Col>
              </Row>
              <Row>
                <Col xs="12">
                  <h1>Payment Details</h1>
                  {payment ? (
                    <>
                      <h4>Card on File</h4>
                      <div>
                        {payment.brand} {payment.last4} Expires{' '}
                        {payment.exp_month}/{payment.exp_year}
                      </div>
                    </>
                  ) : (
                    <div>You currently do not have a card on file.</div>
                  )}
                </Col>
              </Row>
              <Row className="py-3">
                <Col xs="12">
                  <h3>Update Card</h3>
                  {this.state.error && (
                    <Alert color="danger">{this.state.error}</Alert>
                  )}
                  <Elements>
                    <PaymentForm
                      onSuccess={this.onSuccess}
                      onError={this.onError}
                    />
                  </Elements>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
