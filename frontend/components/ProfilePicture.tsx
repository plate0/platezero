import React from 'react'

export interface ProfilePictureProps {
  img: string
  size: number
}

export const ProfilePicture = (props: ProfilePictureProps) => (
  <img
    alt="Avatar"
    src={props.img}
    className="rounded-circle"
    style={{ maxWidth: props.size }}
  />
)
