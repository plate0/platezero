import React from 'react'
import Router from 'next/router'
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
}

export default class ProProfile extends React.Component<ProfileProps, any> {
  constructor(props: ProfileProps) {
    super(props)
    this.state = {
      mustAnswer: toAnswer(props.family.profile),
      users: props.family.users,
      profile: props.family.profile
    }
    this.onAnswer = this.onAnswer.bind(this)
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
    console.log(this.state, this.props)
    const { id: question_id, answer } = response
    const {
      family: { id: family_id },
      user: { id: user_id }
    } = this.props
    const auth = response.is_family ? { family_id } : { user_id }
    try {
      const res = await api.putAnswer({ ...auth, question_id, answer })
      this.setState(s => ({
        family: {
          profile: []
        }
      }))
    } catch (err) {
      console.log(err)
    }
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
            <Col xs={{ offset: 2, size: 8 }} className="text-center">
              <div>
                <ProfilePicture img={user.avatar_url} size={128} />
                <h3>{user.name}</h3>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={{ offset: 2, size: 8 }} className="bg-white">
              <h4 className="my-4 font-weight-light">Family Details</h4>
              <ListGroup flush>
                {familySections.map(section => (
                  <Link route="pro-section" params={{ section }}>
                    <a className="list-group-item d-flex align-items-center justify-content-between text-dark">
                      <div className="d-flex align-items-center">
                        <i className="fad fa-users" />
                        <h5 className="ml-3 mb-0 font-weight-light">
                          {section}
                        </h5>
                      </div>
                      <i className="far fa-chevron-right" />
                    </a>
                  </Link>
                ))}
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={{ offset: 2, size: 8 }} className="bg-white">
              <h4 className="my-4 font-weight-light">User Profiles</h4>
              <ListGroup flush>
                {users.map((u, key) => (
                  <Link route="profile">
                    <a className="list-group-item d-flex align-items-center justify-content-between text-dark">
                      <div className="d-flex align-items-center">
                        <i className="far fa-user" />
                        <h5 className="ml-3 mb-0 font-weight-light">
                          {getName(u)}
                        </h5>
                      </div>
                      <i className="far fa-chevron-right" />
                    </a>
                  </Link>
                ))}
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={{ offset: 2, size: 8 }} className="bg-white">
              <h4 className="my-4 font-weight-light">Account</h4>
              <ListGroup flush>
                <Link route="pro-account">
                  <a className="list-group-item d-flex align-items-center justify-content-between text-dark">
                    <div className="d-flex align-items-center">
                      <i className="fad fa-credit-card" />
                      <h5 className="ml-3 mb-0 font-weight-light">Billing</h5>
                    </div>
                    <i className="far fa-chevron-right" />
                  </a>
                </Link>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
