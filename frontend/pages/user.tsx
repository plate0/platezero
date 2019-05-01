import React, { useState, useEffect } from 'react'
import {
  Row,
  Col,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
  FormText,
  Spinner,
  Label,
  Input
} from 'reactstrap'
import Head from 'next/head'
import ErrorPage from './_error'
import {
  Layout,
  AlertErrors,
  RecipePreview,
  ProfilePicture,
  IfLoggedIn,
  EditableImage
} from '../components'
import { UserJSON, RecipeJSON } from '../models'
import { api, getErrorMessages } from '../common/http'
import { getName } from '../common/model-helpers'

interface UserProps {
  user?: UserJSON
  statusCode?: number
}

export default class User extends React.Component<UserProps> {
  static async getInitialProps({ query, res }) {
    try {
      const { username } = query
      return {
        user: await api.getUser(username)
      }
    } catch (err) {
      const statusCode = err.statusCode || 500
      if (res) {
        res.statusCode = statusCode
      }
      return { statusCode }
    }
  }

  public render() {
    const { user, statusCode } = this.props
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />
    }
    return (
      <Layout>
        <Head>
          <title>{getName(user)} on PlateZero</title>
        </Head>
        <UserProfile initialUser={user} recipes={user.recipes} />
      </Layout>
    )
  }
}

function UserProfile({
  initialUser,
  recipes
}: {
  initialUser: UserJSON
  recipes: RecipeJSON[]
}) {
  const [user, setUser] = useState(initialUser)
  const [avatarErrors, setAvatarErrors] = useState([])
  const [isEditOpen, setEditOpen] = useState(false)
  const [name, setName] = useState(user.name || '')
  const [isSaving, setSaving] = useState(false)
  const [editErrors, setEditErrors] = useState([])

  useEffect(() => {
    setUser(initialUser)
  }, [initialUser])

  const onAvatarChange = async (avatar_url: string) => {
    setAvatarErrors([])
    try {
      const newUser = await api.updateUser({ avatar_url })
      setUser(newUser)
    } catch (err) {
      setAvatarErrors(getErrorMessages(err))
    }
  }

  const toggleEdit = () => setEditOpen(!isEditOpen)

  const saveDisplayName = async () => {
    setSaving(true)
    setEditErrors([])
    try {
      const newUser = await api.updateUser({ name: name || null })
      setUser(newUser)
      setEditOpen(false)
    } catch (err) {
      setEditErrors(getErrorMessages(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Row className="mt-3">
      <Col xs={12} sm={4} md={3} lg={2} className="mr-3 mb-3">
        <div className="mb-3 text-center">
          <ProfilePicture size={128} img={user.avatar_url} />
          <IfLoggedIn username={user.username}>
            <EditableImage
              hasExisting={!!user.avatar_url}
              onUpdate={onAvatarChange}
            />
            <AlertErrors errors={avatarErrors} />
          </IfLoggedIn>
        </div>
        {user.name && (
          <div className="text-truncate" style={{ fontSize: '1.25rem' }}>
            <strong title={user.name}>{user.name}</strong>
          </div>
        )}
        <div
          className="text-muted mb-3 text-truncate"
          style={{ fontSize: '1.25rem' }}
        >
          <span title={user.username}>{user.username}</span>
        </div>
        <IfLoggedIn username={user.username}>
          <Button
            block
            outline
            color="primary"
            size="sm"
            onClick={() => setEditOpen(true)}
          >
            Change Name&hellip;
          </Button>
          <Modal isOpen={isEditOpen} toggle={toggleEdit}>
            <ModalHeader toggle={toggleEdit}>Change Display Name</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label>Display Name</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <FormText>
                  If you add a display name, it will appear instead of your
                  username across PlateZero.
                </FormText>
              </FormGroup>
              <AlertErrors errors={editErrors} />
            </ModalBody>
            <ModalFooter>
              <Button
                color="link"
                className="text-secondary"
                onClick={toggleEdit}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                outline
                onClick={saveDisplayName}
                disabled={isSaving}
              >
                {isSaving && <Spinner size="sm" />} Save Changes
              </Button>
            </ModalFooter>
          </Modal>
        </IfLoggedIn>
      </Col>
      <Col>
        <RecipePreview recipes={recipes} user={user} />
      </Col>
    </Row>
  )
}
