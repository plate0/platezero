import React from 'react'
import { compact } from 'lodash'

const IMAGE_PROXY = 'https://imageproxy.platezero.com/'

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  quality?: string | number
  smartCrop?: boolean
  size?: string | number
  proxy?: string
}

// See: https://godoc.org/willnorris.com/go/imageproxy#ParseOptions
export const buildProxyURL = (props: ImageProps) => {
  const options =
    props.proxy ||
    compact([
      props.smartCrop ? 'sc' : null,
      props.size || null,
      props.width || props.height
        ? `${props.width || ''}x${props.height || ''}`
        : null,
      props.quality ? `q${props.quality}` : null
    ]).join(',')
  return IMAGE_PROXY + (options ? options + '/' : '') + props.src
}

export const Image = props => <img {...props} src={buildProxyURL(props)} />
