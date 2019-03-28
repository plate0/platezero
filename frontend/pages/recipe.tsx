import React, { useState, useContext } from 'react'
import Router from 'next/router'
import * as _ from 'lodash'
import {
  Alert,
  FormGroup,
  Row,
  Col,
  Label,
  Input,
  Modal,
  ModalBody,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from 'reactstrap'
import {
  Head,
  Layout,
  IfLoggedIn,
  RecipeVersion as RecipeVersionView
} from '../components'
import { RecipeJSON } from '../models/recipe'
import { RecipeVersionJSON } from '../models/recipe_version'
import { getName } from '../common/model-helpers'
import {
  PlateZeroApiError,
  getRecipe,
  getRecipeVersion,
  deleteRecipe,
  patchRecipe
} from '../common/http'
import { UserContext } from '../context/UserContext'
import { TokenContext } from '../context/TokenContext'
import { Link } from '../routes'

interface Props {
  recipe: RecipeJSON
  recipeVersion?: RecipeVersionJSON
}

interface State {
  showEditModal: boolean
}

export default class Recipe extends React.Component<Props, State> {
  static async getInitialProps({ query }): Promise<Props> {
    const recipe = await getRecipe(query.username, query.slug)
    const masterBranch = _.head(
      _.filter(recipe.branches, r => r.name === 'master')
    )
    const versionId = _.get(masterBranch, 'recipe_version_id')
    const recipeVersion = versionId
      ? await getRecipeVersion(query.username, query.slug, versionId)
      : undefined
    return { recipe, recipeVersion }
  }

  constructor(props) {
    super(props)
    this.showEditModal = this.showEditModal.bind(this)
    this.state = { showEditModal: false }
  }

  public showEditModal(showEditModal: boolean): void {
    this.setState({ showEditModal })
  }

  public render() {
    const { recipe, recipeVersion } = this.props
    return (
      <Layout>
        <Head
          title={`${recipe.title} - PlateZero`}
          description={recipe.description}
          image={recipe.image_url}
          url={`/${recipe.owner.username}/${recipe.slug}`}
        />
        <Row className="mt-3">
          <Col>
            <h1>{recipe.title}</h1>
            {recipe.subtitle && <p className="lead">{recipe.subtitle}</p>}
            <p className="text-muted">
              By{' '}
              <Link route={`/${recipe.owner.username}`}>
                <a>{getName(recipe.owner)}</a>
              </Link>
            </p>
          </Col>
          <Col xs="auto">
            <IfLoggedIn username={recipe.owner.username}>
              <ActionMenu recipe={recipe} />
            </IfLoggedIn>
          </Col>
        </Row>
        {recipeVersion && <RecipeVersionView recipeVersion={recipeVersion} />}
      </Layout>
    )
  }
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
  const user = useContext(UserContext)
  const token = useContext(TokenContext)
  const handleDelete = async () => {
    try {
      await deleteRecipe(recipe.slug, { token })
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
  const token = useContext(TokenContext)
  const handleSave = async () => {
    const patch = { title, subtitle, description }
    setErrors([])
    try {
      await patchRecipe(recipe.slug, patch, { token })
      Router.push(`/${recipe.owner.username}/${recipe.slug}`)
    } catch (e) {
      if (e instanceof PlateZeroApiError) {
        setErrors(e.messages)
      } else {
        setErrors([e])
      }
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
        {errors.map((e, key) => (
          <Alert color="danger" key={key}>
            {e}
          </Alert>
        ))}
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

const ActionMenu = ({ recipe }: { recipe: RecipeJSON }) => {
  const [isOpen, setOpen] = useState(false)
  const [isRenameModalOpen, setRenameModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  return (
    <>
      <ButtonDropdown isOpen={isOpen} toggle={() => setOpen(!isOpen)}>
        <DropdownToggle
          caret
          outline
          color="primary"
          onClick={() => setOpen(true)}
        >
          Actions
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={() => setRenameModalOpen(true)}>
            Edit Title and Description
          </DropdownItem>
          <DropdownItem
            href={`/${recipe.owner.username}/${
              recipe.slug
            }/branches/master/edit`}
          >
            Update Recipe
          </DropdownItem>
          <DropdownItem
            onClick={() => setDeleteModalOpen(true)}
            className="text-danger"
          >
            Delete Recipe&hellip;
          </DropdownItem>
          {recipe.source_url && (
            <DropdownItem href={recipe.source_url} target="_blank">
              Visit Source Website
            </DropdownItem>
          )}
        </DropdownMenu>
      </ButtonDropdown>
      <RenameModal
        isOpen={isRenameModalOpen}
        recipe={recipe}
        toggle={() => setRenameModalOpen(!isRenameModalOpen)}
        close={() => setRenameModalOpen(false)}
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
