import React, { useState, useRef, useEffect } from 'react'
import { Tooltip as RsTooltip } from 'reactstrap'

export const Tooltip = ({ children, text, id }) => {
  const [open, setOpen] = useState(false)

  const isMounted = useRef(true)
  useEffect(
    () => () => {
      isMounted.current = false
    },
    []
  )

  const toggle = () => {
    // only mutate state if component is mounted
    if (isMounted.current) {
      setOpen(!open)
    }
  }

  return (
    <>
      {children}
      <RsTooltip isOpen={open} target={id} toggle={toggle}>
        {text}
      </RsTooltip>
    </>
  )
}
