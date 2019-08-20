import React, { useState } from 'react'

export const Help = ({ text }) => {
  if (!text) {
    return null
  }
  const [open, setOpen] = useState(false)
  return (
    <div style={{ fontSize: '.9rem' }}>
      <a
        href="javascript:void(0);"
        className="text-muted mb-2"
        onClick={() => setOpen(!open)}
      >
        Why do we need this?
        <i className={`ml-2 fas fa-caret-${open ? 'down' : 'right'}`} />
      </a>
      <p
        style={{ whiteSpace: 'pre-line' }}
        className={`${open ? 'd-block' : 'd-none'}`}
      >
        {text}
      </p>
    </div>
  )
}
