import React from 'react'
import {
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  FormText,
  Label,
  Input
} from 'reactstrap'
import Head from 'next/head'
import { Layout, ProfilePicture, EditableImage } from '../components'
import { api } from '../common/http'
import { getName } from '../common/model-helpers'
import { UserContext } from '../context/UserContext'
import { logout } from '../common'

interface ProfileProps {
  user?: UserJSON
  statusCode?: number
}

interface ProfileState {
  user: UserJSON
  avatarErrors: string[]
  isEditOpen: boolean
  name: string
  isSaving: boolean
  editErrors: string[]
}

export default class Profile extends React.Component<
  ProfileProps,
  ProfileState
> {
  constructor(props: ProfileProps) {
    super(props)
    this.state = {
      avatarErrors: [],
      isEdit: false,
      name: props.user.name,
      isSaving: false,
      editErrors: [],
      user: props.user
    }
    this.onAvatarChange = this.onAvatarChange.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  static async getInitialProps() {
    try {
      return {
        user: await api.getCurrentUser()
      }
    } catch (err) {
      const statusCode = err.statusCode || 500
      if (res) {
        res.statusCode = statusCode
      }
      return { statusCode }
    }
  }

  private async onAvatarChange(avatar_url: string) {
    this.setState({
      avatarErrors: []
    })
    try {
      const user = await api.updateUser({ avatar_url })
      this.setState({
        user
      })
    } catch (err) {
      this.setState({
        avatarErrors: getErrorMessages(err)
      })
    }
  }

  public async onSave(e: any) {
    e.preventDefault()
    this.setState({ isSaving: true, editErrors: [] })
    try {
      const newUser = await api.updateUser({ name: this.state.name || null })
      this.setState({
        user: newUser
      })
    } catch (err) {
      this.setState({
        editErrors: getErrorMessages(err)
      })
    } finally {
      this.setState({
        isSaving: false
      })
    }
  }

  public render() {
    const { user, statusCode } = this.props
    const { isSaving } = this.state
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />
    }
    const name = getName(user)
    return (
      <Layout title={name}>
        <Head>
          <title>{name} Profile</title>
        </Head>
        <Row className="">
          <Col className="mt-3 text-center">
            <ProfilePicture size={64} img={user.avatar_url} />
            <EditableImage
              hasExisting={!!user.avatar_url}
              onUpdate={this.onAvatarChange}
            />
          </Col>
        </Row>
        <Row>
          <Col className="justify-content-center">
            <Form onSubmit={this.onSave}>
              <FormGroup row>
                <Label for="name" xs={3}>
                  Name
                </Label>
                <Col xs={9}>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={this.state.name}
                    onChange={e => this.setState({ name: e.target.value })}
                  />
                  <FormText>
                    If you add a display name, it will appear instead of your
                    username across PlateZero. Your username will still be{' '}
                    <strong>{user.username}</strong> and your URL will still be{' '}
                    <code>platezero.com/{user.username}</code>.
                  </FormText>
                </Col>
              </FormGroup>
              <div className="text-center d-flex">
                <Button
                  type="submit"
                  color="success"
                  className="px-3 flex-fill"
                  disabled={isSaving}
                >
                  Save
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
        <Row className="mt-6">
          <Col xs="12">
            <h3>Other Options</h3>
          </Col>
          <Col xs="12" className="d-flex">
            <UserContext.Consumer>
              {({ updateUser }) => (
                <Button
                  outline
                  color="danger"
                  className="flex-fill"
                  onClick={() => {
                    logout()
                    const w = window as any
                    if (w && w._paq) {
                      w._paq.push(['resetUserId'])
                      w._paq.push(['trackPageView'])
                    }
                    updateUser(null)
                  }}
                >
                  Logout
                </Button>
              )}
            </UserContext.Consumer>
          </Col>
        </Row>
      </Layout>
    )
  }
}
