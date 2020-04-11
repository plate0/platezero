import React from 'react'
import { Alert } from 'reactstrap'

export const AlertErrors = ({
  errors,
  className
}: {
  errors?: string[]
  className?: string
}) => {
  if (!errors || !errors.length) {
    return null
  }
  return (
    <Alert color="danger" className={className || ''}>
      <ul className="mb-0 pl-3">
        {errors.map((err, key) => (
          <li key={key}>{err}</li>
        ))}
      </ul>
    </Alert>
  )
}
