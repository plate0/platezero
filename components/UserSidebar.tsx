import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  FormGroup,
  FormText,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from 'reactstrap'
import { api, getErrorMessages } from '../common/http'
import { UserJSON } from '../models'
import { AlertErrors } from './AlertErrors'
import { EditableImage } from './EditableImage'
import { IfLoggedIn } from './IfLoggedIn'
import { ProfilePicture } from './ProfilePicture'

export const UserSidebar = (props: { user: UserJSON }) => {
  const [user, setUser] = useState(props.user)
  const [avatarErrors, setAvatarErrors] = useState([])
  const [isEditOpen, setEditOpen] = useState(false)
  const [name, setName] = useState(user.name || '')
  const [isSaving, setSaving] = useState(false)
  const [editErrors, setEditErrors] = useState([])

  useEffect(() => {
    setUser(props.user)
  }, [props.user])

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
    <>
      <Row>
        <Col xs="6" sm="12">
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
        </Col>
        <Col xs="6" sm="12" className="mb-3">
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
              outline
              color="secondary"
              size="sm"
              onClick={() => setEditOpen(true)}
            >
              Edit Name&hellip;
            </Button>
          </IfLoggedIn>
        </Col>
      </Row>
      <Modal isOpen={isEditOpen} toggle={toggleEdit}>
        <ModalHeader toggle={toggleEdit}>Change Display Name</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Input
              type="text"
              value={name}
              bsSize="lg"
              placeholder="None"
              onChange={(e) => setName(e.target.value)}
            />
            <FormText>
              If you add a display name, it will appear instead of your username
              across PlateZero. Your username will still be{' '}
              <strong>{user.username}</strong> and your URL will still be{' '}
              <code>platezero.com/{user.username}</code>.
            </FormText>
          </FormGroup>
          <AlertErrors errors={editErrors} />
        </ModalBody>
        <ModalFooter>
          <Button color="link" className="text-secondary" onClick={toggleEdit}>
            Cancel
          </Button>
          <Button
            color="primary"
            outline
            onClick={saveDisplayName}
            disabled={isSaving}
          >
            {isSaving && <Spinner size={'sm' as any} />} Save Changes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
