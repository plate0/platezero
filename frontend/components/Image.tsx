import React from 'react'

const IMAGE_PROXY = 'https://imageproxy.platezero.com/'

export const Image = props => <img {...props} src={IMAGE_PROXY + props.src} />

// See: https://godoc.org/willnorris.com/go/imageproxy#ParseOptions
export const imageProxy = (src: string, options?: string = '') =>
  IMAGE_PROXY + (options ? options + '/' : '') + src
