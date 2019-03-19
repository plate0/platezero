import React from 'react'
import { ProfilePicture } from './ProfilePicture'
import { Row, Col } from 'reactstrap'
import { UserJSON } from '../models'
import { Link } from '../routes'

export const ProfileHeader = ({ user }: { user: UserJSON }) => (
  <Row className="mt-3 d-flex justify-content-center">
    <Link to={`/${user.username}`}>
      <a>
        <Col xs={{ size: 'auto' }} className="text-center">
          <ProfilePicture size={128} img={user.avatar_url} />
          <h3 className="text-dark">{user.name ? user.name : user.username}</h3>
        </Col>
        <style jsx>
          {`
            a:hover {
              text-decoration: none;
            }
          `}
        </style>
      </a>
    </Link>
  </Row>
)
