import React from 'react'
import NextHead from 'next/head'
import { defaults } from 'lodash'

// http://ogp.me/
const defaultMetaTags = {
  site: 'PlateZero',
  type: 'website'
}

export interface HeadProps {
  title: string
  description: string
  image?: string
  site?: string
  author?: string
  url: string
  type?: string
}

export const Head = (props: HeadProps) => {
  const meta = defaults(props, defaultMetaTags)
  return (
    <NextHead>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta
        name="twitter:card"
        content={meta.image ? 'summary_large_image' : 'summary'}
      />
      <meta name="twitter:site" content="@platezer0" />
      {meta.image && <meta name="twitter:image:src" content={meta.image} />}
      <meta property="og:title" content={meta.title} />
      <meta property="og:type" content={meta.type} />
      <meta property="og:url" content={meta.url} />
      {meta.image && <meta property="og:image" content={meta.image} />}
      <meta property="og:description" content={meta.description} />
      <meta property="og:site_name" content={meta.site} />
    </NextHead>
  )
}
