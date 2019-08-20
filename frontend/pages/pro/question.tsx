import React from 'react'
import { Router } from '../../routes'
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
import { Question } from '../../components/pro'

const ProLogin = '/pro/login'

interface ProfileQuestionProps {
  user?: UserJSON
  family?: FamilyJSON
  section: string
  question: ProfileQuestionJSON
}

export default class QuestionSection extends React.Component<
  ProfileQuestionProps,
  any
> {
  constructor(props: ProfileQuestionProps) {
    super(props)
    this.state = {}
    this.onAnswer = this.onAnswer.bind(this)
  }

  static async getInitialProps({ query, res }) {
    const { id, section } = query
    try {
      const user = await api.getCurrentUser()
      if (!user) {
        return redirect(res, ProLogin)
      }
      const family = await api.getProFamily()
      const question = await api.getProQuestion(id)
      return {
        family,
        user,
        question,
        section
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
      await api.putAnswer({ ...auth, question_id, answer })
      Router.pushRoute('pro-section', { section: this.props.section })
    } catch (err) {
      console.log(err)
    }
  }

  public render() {
    const { question, section } = this.props
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
              <Question question={question} onAnswer={this.onAnswer} />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
