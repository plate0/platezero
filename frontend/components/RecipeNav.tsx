import React, { useState, useContext } from 'react'
import Router from 'next/router'
import { Modal, ModalBody, Button } from 'reactstrap'

import { RecipeJSON } from '../models/recipe'
import { UserCard } from './UserCard'
import { IfLoggedIn } from './IfLoggedIn'
import { Link } from '../routes'
import { deleteRecipe } from '../common/http'
import { UserContext } from '../context/UserContext'

interface RecipeNavProps {
  recipe: RecipeJSON
  token: string
}

export const RecipeNav = (props: RecipeNavProps) => {
  const { recipe } = props
  const { owner } = recipe
  return (
    <div className="my-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1>
            <Link route={`/${owner.username}/${recipe.slug}`}>
              <a>{recipe.title}</a>
            </Link>
          </h1>
          {recipe.subtitle && <div className="lead">{recipe.subtitle}</div>}
        </div>
        <UserCard user={owner} />
      </div>
      <IfLoggedIn username={props.recipe.owner.username}>
        <div className="text-right">
          <EditButton recipe={recipe} branch="master" />{' '}
          <DeleteButton recipe={recipe} token={props.token} />
        </div>
      </IfLoggedIn>
    </div>
  )
}

const EditButton = (props: { recipe: RecipeJSON; branch: string }) => (
  <Link
    route={`/${props.recipe.owner.username}/${props.recipe.slug}/branches/${
      props.branch
    }/edit`}
  >
    <a className="btn btn-sm btn-outline-primary">Edit</a>
  </Link>
)

const DeleteButton = (props: { token: string; recipe: RecipeJSON }) => {
  const [isOpen, setOpen] = useState(false)
  const user = useContext(UserContext)
  const handleDelete = async () => {
    try {
      await deleteRecipe(props.recipe.slug, { token: props.token })
    } catch {}
    Router.push(`/${user.username}`)
  }
  return (
    <>
      <Button color="danger" outline size="sm" onClick={() => setOpen(true)}>
        Delete&hellip;
      </Button>
      <Modal isOpen={isOpen} toggle={() => setOpen(!isOpen)}>
        <ModalBody>
          <h5>Permanently delete {props.recipe.title}</h5>
          <p>
            Are you sure you want to permanently delete{' '}
            <strong>{props.recipe.title}</strong>?
          </p>
          <Button color="danger" block onClick={handleDelete}>
            Yes, delete it forever
          </Button>
          <Button
            color="link"
            className="text-muted"
            outline
            block
            onClick={() => setOpen(false)}
          >
            Never mind, keep it for now
          </Button>
        </ModalBody>
      </Modal>
    </>
  )
}
