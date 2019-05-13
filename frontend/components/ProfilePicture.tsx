import React from 'react'
import { imageProxy } from './Image'

export interface ProfilePictureProps {
  img: string
  size: number
}

export const ProfilePicture = (props: ProfilePictureProps) => (
  <img
    alt="Avatar"
    src={
      imageProxy(props.img, `${props.size}`) ||
      'https://static.platezero.com/default_avatar.png'
    }
    className="rounded-circle border bg-light"
    style={{ width: props.size, height: props.size, objectFit: 'cover' }}
  />
)
