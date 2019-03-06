import React from 'react'
import { UserJSON } from '../models/user'
import { ProfilePicture } from './ProfilePicture'
const {
  routes: { Link }
} = require('../routes')

export const UserCard = (props: { user: UserJSON; compact?: boolean }) => {
  const route = `/${props.user.username}`
  return (
    <Link route={route}>
      <a className="d-block">
        <div className="d-flex align-items-center">
          <div className="mr-3">
            <ProfilePicture
              img={props.user.avatar_url}
              size={props.compact ? 30 : 50}
            />
          </div>
          {props.compact || (
            <div>
              {props.user.name ? props.user.name : props.user.username}
              {props.user.name && (
                <div className="text-muted">@{props.user.username}</div>
              )}
            </div>
          )}
        </div>
      </a>
    </Link>
  )
}
