import React from 'react'
import { Image } from './Image'

export interface ProfilePictureProps {
  img: string
  size: number
}

export const ProfilePicture = (props: ProfilePictureProps) => (
  <Image
    alt="Avatar"
    width={props.size}
    height={props.size}
    src={props.img || 'https://static.platezero.com/default_avatar.png'}
    className="rounded-circle border bg-light"
    style={{ width: props.size, height: props.size, objectFit: 'cover' }}
  />
)
