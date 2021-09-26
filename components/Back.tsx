import Link from 'next/link'
import React from 'react'

export const Back = ({ route }) => {
  return (
    <Link href={route}>
      <a className="btn btn-link text-dark mt-3">
        <i className="far fa-chevron-double-left mr-2" />
        Cancel and go back
      </a>
    </Link>
  )
}

// new-recipe
