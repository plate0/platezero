import React from 'react'
import { Button, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap'
import Head from 'next/head'
import { Layout, ProfilePicture, EditableImage } from '../components'
import { api } from '../common/http'
import { getName } from '../common/model-helpers'

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
      name: '',
      isSaving: false,
      editErrors: [],
      user: props.user
    }
    this.onAvatarChange = this.onAvatarChange.bind(this)
  }

  static async getInitialProps({}) {
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

  public render() {
    const { user, statusCode } = this.props
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
            <Form>
              <FormGroup row>
                <Label for="name" xs={3}>
                  Name
                </Label>
                <Col xs={9}>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={user.username}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="username" xs={3}>
                  Username
                </Label>
                <Col xs={9}>
                  <Input
                    type="text"
                    name="username"
                    id="username"
                    value={user.username}
                  />
                </Col>
              </FormGroup>
              <div className="text-center d-flex">
                <Button
                  type="submit"
                  color="success"
                  className="px-3 flex-fill"
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
            <Button outline color="danger" className="flex-fill">
              Logout
            </Button>
          </Col>
        </Row>
      </Layout>
    )
  }
}
