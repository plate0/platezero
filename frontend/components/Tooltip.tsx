import React, { useState } from 'react'
import { Tooltip as RsTooltip } from 'reactstrap'
import { hash } from '../common'

export const Tooltip = ({ children, tip }) => {
  const [open, setOpen] = useState(false)
  const [id] = useState(hash(tip))
  return (
    <>
      <div id={id}>{children}</div>
      <RsTooltip isOpen={open} target={id} toggle={() => setOpen(!open)}>
        {tip}
      </RsTooltip>
    </>
  )
}
