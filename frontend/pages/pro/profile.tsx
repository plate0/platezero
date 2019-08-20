import React from 'react'
import Router from 'next/router'
import Head from 'next/head'
import * as _ from 'lodash'
import {
  ListGroup,
  ListGroupItem,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  Container,
  Col,
  Row
} from 'reactstrap'
import { Elements } from 'react-stripe-elements'
import { PaymentForm } from '../../components/pro'
import { ProfilePicture } from '../../components'
import { api } from '../../common/http'
import { Link } from '../../routes'
import { redirect } from '../../common/redirect'
import { Layout, Questions } from '../../components/pro'
import { UserJSON, FamilyJSON, ProfileQuestionJSON } from '../../models'
import { getName } from '../../common/model-helpers'

const ProLogin = '/pro/login'

const toAnswer = (questions: ProfileQuestionJSON[]): ProfileQuestionJSON[] =>
  questions.filter(q => q.priority === 0 && !q.answer)

const getFamilySections = (questions: ProfileQuestionJSON[]): string[] =>
  _.uniq(_.map(_.filter(questions, 'is_family'), 'section')).filter(
    s => s !== 'Account'
  )

const icons = {
  Family: 'fa-users'
}

interface ProfileProps {
  user?: UserJSON
  family?: FamilyJSON
}

interface ProfileState {
  users: UserJSON[]
  profile: ProfileQuestionJSON[]
  mustAnswer: ProfileQuestionJSON[]
  billing?: UserProfileQuestion
  payment?: any
  error?: string
}

export default class ProProfile extends React.Component<ProfileProps, any> {
  constructor(props: ProfileProps) {
    super(props)
    const billing = _.first(_.filter(props.family.profile, { type: 'Billing' }))
    let payment = undefined
    try {
      payment =
        billing && billing.answer ? JSON.parse(billing.answer) : undefined
    } catch (err) {}
    this.state = {
      mustAnswer: toAnswer(props.family.profile),
      users: props.family.users,
      profile: props.family.profile,
      billing,
      payment
    }
    this.onAnswer = this.onAnswer.bind(this)
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
      return {
        family,
        user
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

  public async onAnswer(response: ProfileQuestionJSON) {
    const { id: question_id, answer } = response
    const {
      family: { id: family_id },
      user: { id: user_id }
    } = this.props
    const auth = response.is_family ? { family_id } : { user_id }
    try {
      const res = await api.putAnswer({ ...auth, question_id, answer })
      this.setState(s => ({
        mustAnswer: s.mustAnswer.filter(q => q.id != question_id)
      }))
    } catch (err) {
      console.log(err)
    }
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
      this.setState({ payment: res.token.card })
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  public onError(err: Error) {
    this.setState({ error: err.message })
  }

  public render() {
    const { user } = this.props
    const { profile, users, mustAnswer } = this.state
    if (mustAnswer.length > 0) {
      return (
        <Layout>
          <Questions
            questions={mustAnswer}
            onAnswer={this.onAnswer}
            captive={mustAnswer.filter(q => q.priority == 0).length > 0}
          />
        </Layout>
      )
    }
    const familySections = getFamilySections(profile)
    const { payment } = this.state
    return (
      <>
        <Head>
          <title>PlateZero Pro</title>
        </Head>
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
              <Col xs={{ offset: 2, size: 8 }} className="text-center">
                <div>
                  <ProfilePicture img={user.avatar_url} size={128} />
                  <h3>{user.name}</h3>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs="12" md={{ offset: 2, size: 8 }} className="bg-white">
                <h4 className="my-4 font-weight-light">Billing</h4>
                <Row>
                  <Col xs="12">
                    {payment ? (
                      <>
                        <div className="py-3 border-top border-bottom d-flex align-items-center justify-content-between">
                          <div className="d-flex">
                            <i
                              className={`fa-2x fab fa-cc-${_.toLower(
                                payment.brand
                              )}`}
                            />
                            <div className="text-muted ml-3 d-flex align-items-center">
                              &bull;&bull;&bull;&bull;
                            </div>
                            <div className="text-muted ml-2 d-flex align-items-center">
                              &bull;&bull;&bull;&bull;
                            </div>
                            <div className="text-muted ml-2 d-flex align-items-center">
                              &bull;&bull;&bull;&bull;
                            </div>
                            <div className="text-muted ml-2 d-flex align-items-center">
                              {payment.last4}
                            </div>
                          </div>
                          <div className="ml-3">
                            {payment.exp_month}/{payment.exp_year}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div>You currently do not have a card on file.</div>
                    )}
                  </Col>
                </Row>
                <Row className="py-3">
                  <Col xs="12">
                    <h4 className="my-4 font-weight-light">Update Payment</h4>
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
      </>
    )
  }
}
