import React from 'react'
import ReactMarkdown from 'react-markdown'

export const Markdown = ({ source }: { source: string }) => (
  <ReactMarkdown
    source={source}
    allowedTypes={[
      'root',
      'text',
      'paragraph',
      'strong',
      'emphasis',
      'link',
      'break',
      'table',
      'tableHead',
      'tableBody',
      'tableRow',
      'tableCell'
    ]}
    unwrapDisallowed={true}
    linkTarget="_blank"
    transformLinkUri={myUriTransformer}
  />
)

export const MarkdownInline = ({ source }: { source: string }) => (
  <ReactMarkdown
    source={source}
    allowedTypes={['text', 'strong', 'emphasis', 'link', 'break']}
    unwrapDisallowed={true}
    linkTarget="_blank"
    transformLinkUri={myUriTransformer}
  />
)

// Ensure local URI starts with '/', it's easy to miss
function myUriTransformer(uri) {
  const uril = uri.toLowerCase()
  if (
    !uril.startsWith('http:') &&
    !uril.startsWith('https:') &&
    !uril.startsWith('/')
  ) {
    return '/' + uri
  } else {
    return ReactMarkdown.uriTransformer(uri)
  }
}
