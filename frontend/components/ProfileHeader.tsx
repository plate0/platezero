import React from 'react'
import { ProfilePicture } from './ProfilePicture'
import { Row, Col } from 'reactstrap'
import { UserJSON } from '../models'

export const ProfileHeader = ({ user }: { user: UserJSON }) => (
  <Row className="mt-3 d-flex justify-content-center">
    <Col xs={{ size: 'auto' }} className="text-center">
      <ProfilePicture size={128} img={user.avatar_url} />
      <h3>{user.name ? user.name : user.username}</h3>
    </Col>
  </Row>
)
