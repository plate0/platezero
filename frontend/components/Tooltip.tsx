import React, { useState, useRef, useEffect } from 'react'
import { Tooltip as RsTooltip } from 'reactstrap'
import { hash } from '../common'

export const Tooltip = ({ children, tip }) => {
  const [open, setOpen] = useState(false)
  const [id] = useState(hash(tip))
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
      <div id={id}>{children}</div>
      <RsTooltip isOpen={open} target={id} toggle={toggle}>
        {tip}
      </RsTooltip>
    </>
  )
}
