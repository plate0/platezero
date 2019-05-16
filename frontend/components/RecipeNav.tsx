import React, { useState, useContext } from 'react'
import Router from 'next/router'
import { get } from 'lodash'
import {
  FormGroup,
  Label,
  Input,
  Modal,
  ModalBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap'
import getConfig from 'next/config'
import { RecipeJSON } from '../models/recipe'
import { UserContext } from '../context/UserContext'
import { getErrorMessages, api } from '../common/http'
import { IfLoggedIn } from './IfLoggedIn'
import { AlertErrors } from './AlertErrors'
import { Link } from '../routes'
import { PrintButton } from './PrintButton'
import { ShareButton } from './ShareButton'
const SITE_URL = get(getConfig(), 'publicRuntimeConfig.www.url', '')

export const RecipeNav = ({
  recipe,
  route
}: {
  recipe: RecipeJSON
  route: string
}) => {
  const baseURL = `/${recipe.owner.username}/${recipe.slug}`
  return (
    <Nav className="mb-3 d-print-none recipe-nav">
      <NavItem active={route === '/recipe'}>
        <Link route={baseURL} passHref>
          <NavLink active={route === '/recipe'}>Recipe</NavLink>
        </Link>
      </NavItem>
      <NavItem active={route === '/recipe-history'}>
        <Link route={`${baseURL}/history`} passHref>
          <NavLink active={route === '/recipe-history'}>History</NavLink>
        </Link>
      </NavItem>
      <NavItem className="border-bottom flex-fill" />
      <NavItem className="border-bottom pr-2">
        <div className="align-items-center d-flex h-100">
          <ShareButton url={SITE_URL + baseURL} />
        </div>
      </NavItem>
      <NavItem className="border-bottom">
        <div className="align-items-center d-flex h-100">
          <PrintButton />
        </div>
      </NavItem>
      <div className="border-bottom">
        <IfLoggedIn username={recipe.owner.username}>
          <ActionMenu recipe={recipe} />
        </IfLoggedIn>
      </div>
      <style jsx global>
        {`
          .recipe-nav .nav-item:not(.active) {
            border-bottom: 1px solid #dee2e6;
          }
          .recipe-nav .nav-link.active {
            border-bottom: 3px #19afd0 solid;
          }
        `}
      </style>
    </Nav>
  )
}

const ActionMenu = ({ recipe }: { recipe: RecipeJSON }) => {
  const [isOpen, setOpen] = useState(false)
  const [isRenameModalOpen, setRenameModalOpen] = useState(false)
  const [isAttributionModalOpen, setAttributionModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  return (
    <>
      <Dropdown
        nav
        isOpen={isOpen}
        toggle={() => setOpen(!isOpen)}
        className="border-0"
      >
        <DropdownToggle nav caret onClick={() => setOpen(true)}>
          Actions
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={() => setRenameModalOpen(true)}>
            Edit Title and Description
          </DropdownItem>
          <DropdownItem onClick={() => setAttributionModalOpen(true)}>
            Edit Attribution
          </DropdownItem>
          <DropdownItem
            href={`/${recipe.owner.username}/${
              recipe.slug
            }/branches/master/edit`}
          >
            Edit Recipe
          </DropdownItem>
          <DropdownItem
            onClick={() => setDeleteModalOpen(true)}
            className="text-danger"
          >
            Delete Recipe&hellip;
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <RenameModal
        isOpen={isRenameModalOpen}
        recipe={recipe}
        toggle={() => setRenameModalOpen(!isRenameModalOpen)}
        close={() => setRenameModalOpen(false)}
      />
      <AttributionModal
        isOpen={isAttributionModalOpen}
        recipe={recipe}
        toggle={() => setAttributionModalOpen(!isAttributionModalOpen)}
        close={() => setAttributionModalOpen(false)}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        recipe={recipe}
        toggle={() => setDeleteModalOpen(!isDeleteModalOpen)}
        close={() => setDeleteModalOpen(false)}
      />
    </>
  )
}

const DeleteModal = ({
  recipe,
  isOpen,
  toggle,
  close
}: {
  recipe: RecipeJSON
  isOpen: boolean
  toggle: () => void
  close: () => void
}) => {
  const { user } = useContext(UserContext)
  const handleDelete = async () => {
    try {
      await api.deleteRecipe(recipe.slug)
    } catch {}
    Router.push(`/${user.username}`)
  }
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalBody>
        <h5>Permanently delete {recipe.title}</h5>
        <p>
          Are you sure you want to permanently delete{' '}
          <strong>{recipe.title}</strong>?
        </p>
        <Button color="danger" block onClick={handleDelete}>
          Yes, delete it forever
        </Button>
        <Button
          color="link"
          className="text-muted"
          outline
          block
          onClick={close}
        >
          Never mind, keep it for now
        </Button>
      </ModalBody>
    </Modal>
  )
}

const AttributionModal = ({
  recipe,
  isOpen,
  toggle,
  close
}: {
  recipe: RecipeJSON
  isOpen: boolean
  toggle: () => void
  close: () => void
}) => {
  const [source_url,    setSourceUrl]    = useState(recipe.source_url)
  const [source_title,  setSourceTitle]  = useState(recipe.source_title)
  const [source_author, setSourceAuthor] = useState(recipe.source_author)
  const [source_isbn,   setSourceIsbn]   = useState(recipe.source_isbn)
  const [errors, setErrors] = useState([])
  const handleSave = async () => {
  const patch = { 
        source_url,   
        source_title, 
        source_author,
        source_isbn,  
        }
    setErrors([])
    try {
      await api.patchRecipe(recipe.slug, patch)
      Router.push(`/${recipe.owner.username}/${recipe.slug}`)
    } catch (e) {
      setErrors(getErrorMessages(e))
    }
  }
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalBody>
        <FormGroup>
          <Label>Source Title</Label>
          <Input value={source_title} onChange={e => setSourceTitle(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>Source Author</Label>
          <Input value={source_author} onChange={e => setSourceAuthor(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>Source ISBN</Label>
          <Input value={source_isbn} onChange={e => setSourceIsbn(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>Source URL</Label>
          <Input value={source_url} onChange={e => setSourceUrl(e.target.value)} />
        </FormGroup>
        <AlertErrors errors={errors} className="mt-3 mb-0 small" />
        <Button color="success" block onClick={handleSave}>
          Save
        </Button>
        <Button
          color="link"
          className="text-muted"
          outline
          block
          onClick={close}
        >
          Never mind
        </Button>
      </ModalBody>
    </Modal>
  )
}

const RenameModal = ({
  recipe,
  isOpen,
  toggle,
  close
}: {
  recipe: RecipeJSON
  isOpen: boolean
  toggle: () => void
  close: () => void
}) => {
  const [title, setTitle] = useState(recipe.title)
  const [subtitle, setSubtitle] = useState(recipe.subtitle || '')
  const [description, setDescription] = useState(recipe.description || '')
  const [errors, setErrors] = useState([])
  const handleSave = async () => {
    const patch = { title, subtitle, description }
    setErrors([])
    try {
      await api.patchRecipe(recipe.slug, patch)
      Router.push(`/${recipe.owner.username}/${recipe.slug}`)
    } catch (e) {
      setErrors(getErrorMessages(e))
    }
  }
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalBody>
        <FormGroup>
          <Label>Recipe Title</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>Subtitle</Label>
          <Input value={subtitle} onChange={e => setSubtitle(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>Description</Label>
          <Input
            type="textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </FormGroup>
        <AlertErrors errors={errors} className="mt-3 mb-0 small" />
        <Button color="success" block onClick={handleSave}>
          Save
        </Button>
        <Button
          color="link"
          className="text-muted"
          outline
          block
          onClick={close}
        >
          Never mind
        </Button>
      </ModalBody>
    </Modal>
  )
}
