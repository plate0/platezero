import React from 'react'
import { IfLoggedIn } from './IfLoggedIn'
import { Link } from '../routes'
import { Blankslate } from './Blankslate'

export const RecipeListBlankslate = (props: { username: string }) => (
  <Blankslate>
    <h1>No recipes yet :(</h1>
    <IfLoggedIn username={props.username}>
      <Link route="/recipes/new">
        <a className="btn btn-primary">Create your first!</a>
      </Link>
    </IfLoggedIn>
  </Blankslate>
)

export const RecipeListNoSearchResults = ({
  username
}: {
  username: string
}) => (
  <Blankslate className="mt-3">
    <h4 className="m-0">{username} doesn't have any recipes that match.</h4>
  </Blankslate>
)
