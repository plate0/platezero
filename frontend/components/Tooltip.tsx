import React, { useState } from 'react'
import { Tooltip as RsTooltip } from 'reactstrap'

export const Tooltip = ({ children, text, id }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      {children}
      <RsTooltip isOpen={open} target={id} toggle={() => setOpen(!open)}>
        {text}
      </RsTooltip>
    </>
  )
}
