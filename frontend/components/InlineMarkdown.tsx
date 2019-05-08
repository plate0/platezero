import React from 'react'
import * as ReactMarkdown from 'react-markdown'

export const InlineMarkdown = ({ source }: { source: string }) => (
  <ReactMarkdown
    source={source}
    allowedTypes={[
      'root',
      'text',
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
