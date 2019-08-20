import React from 'react'
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
import { Link } from '../../routes'
import { api } from '../../common/http'
import { UserJSON, FamilyJSON, ProfileQuestionJSON } from '../../models'
import { redirect } from '../../common/redirect'
import { filter } from 'lodash'

const ProLogin = '/pro/login'

interface ProfileSectionProps {
  user?: UserJSON
  family?: FamilyJSON
  section: string
  questions: ProfileQuestionJSON[]
}

export default class ProfileSection extends React.Component<ProfileProps, any> {
  constructor(props: ProfileSectionProps) {
    super(props)
    this.state = {}
  }

  static async getInitialProps({ query, res }) {
    const { id } = query
    try {
      const user = await api.getCurrentUser()
      if (!user) {
        return redirect(res, ProLogin)
      }
      const family = await api.getUserProfile()
      const questions = filter(family.profile, { section })
      return {
        family,
        user,
        section,
        questions
      }
    } catch (err) {
      console.log(err)
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

  public render() {
    const { questions, section } = this.props
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
              <h4 className="my-4 font-weight-light">{section}</h4>
              <ListGroup flush>
                {questions.map(q => (
                  <Link
                    key={q.id}
                    route="pro-question"
                    params={{ section, id: q.id }}
                  >
                    <a className="list-group-item d-flex align-items-center justify-content-between text-dark">
                      <div className="d-flex align-items-center">
                        <i
                          className={`fal fa-${
                            q.answer
                              ? 'check text-success'
                              : 'question-circle text-danger'
                          }`}
                        />
                        <h5 className="ml-3 mb-0 font-weight-light">
                          {q.question}
                        </h5>
                      </div>
                      <i className="far fa-chevron-right" />
                    </a>
                  </Link>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
