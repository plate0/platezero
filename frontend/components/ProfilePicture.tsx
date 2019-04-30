import React from 'react'

export interface ProfilePictureProps {
  img: string
  size: number
}

export const ProfilePicture = (props: ProfilePictureProps) => (
  <img
    alt="Avatar"
    src={props.img || 'https://static.platezero.com/default_avatar.png'}
    className="rounded-circle border bg-light"
    style={{ width: props.size, height: props.size, objectFit: 'cover' }}
  />
)
