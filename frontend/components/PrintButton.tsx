import React from 'react'
import { Button } from 'reactstrap'

export const PrintButton = (props = {}) => (
  <Button
    color="primary"
    className={`rounded-circle btn-sm ${props.className || ''}`}
    onClick={() => print()}
    style={{ height: 32, width: 32 }}
    {...props}
  >
    <i className="fal fa-print" />
  </Button>
)
