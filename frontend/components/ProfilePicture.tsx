import React from 'react'

export interface ProfilePictureProps {
  img: string
  size: number
}

export const ProfilePicture = (props: ProfilePictureProps) => (
  <img
    alt="Avatar"
    src={props.img}
    className="rounded-circle border bg-light"
    style={{ width: props.size, height: props.size, objectFit: 'cover' }}
  />
)
