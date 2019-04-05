import React from 'react'

import { IfLoggedIn } from './IfLoggedIn'
import { Link } from '../routes'

export const RecipeListBlankslate = (props: { username: string }) => (
  <div className="bg-light text-secondary text-center rounded p-5 mt-3">
    <h1>No recipes yet :(</h1>
    <IfLoggedIn username={props.username}>
      <Link route="/recipes/new">
        <a className="btn btn-primary">Create your first!</a>
      </Link>
    </IfLoggedIn>
  </div>
)
