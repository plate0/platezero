import React from 'react'
import * as ReactMarkdown from 'react-markdown'

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
  />
)
