import React from 'react'
import { Link } from '../routes'

export const Back = ({ route }) => {
  return (
    <Link route={route}>
      <a className="btn btn-link text-dark mt-3">
        <i className="far fa-chevron-double-left mr-2" />
        Cancel and go back
      </a>
    </Link>
  )
}

// new-recipe
