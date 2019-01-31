import React from 'react'
import { ProfilePicture } from './ProfilePicture'
import { Row, Col } from 'reactstrap'

// TODO: Fix
export const ProfileHeader = (user: any) => (
  <Row className="mt-3 d-flex justify-content-center">
    <Col xs={{ size: 'auto' }} className="text-center">
      <ProfilePicture size={128} img={user.avatar} />
      <h3>{user.username}</h3>
    </Col>
  </Row>
)
