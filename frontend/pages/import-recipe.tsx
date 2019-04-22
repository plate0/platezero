import React from 'react'
import {
  Row,
  Alert,
  Col,
  Spinner,
  ListGroup,
  ListGroupItem,
  Button,
  Form,
  Input,
  InputGroup,
  InputGroupAddon
} from 'reactstrap'
import Head from 'next/head'
import { AlertErrors, Dropzone, Layout } from '../components'
import * as _ from 'lodash'
import { api, getErrorMessages } from '../common'
import { RecipeJSON } from '../models'
import { Link } from '../routes'
import uuid from 'uuid/v4'

interface ImportRequest {
  id: string
  body: File | string
  done?: boolean
  success?: boolean
  recipe?: RecipeJSON
  errors?: string[]
}

const ImportStatus = ({ upload }: { upload: ImportRequest }) => {
  const name = _.isString(upload.body) ? upload.body : upload.body.name
  const spinnerOrDone = upload.done ? (
    upload.errors ? (
      <i className="ml-2 far fa-exclamation-triangle text-danger" />
    ) : (
      <i className="ml-2 far fa-check text-success" />
    )
  ) : (
    <Spinner color="info" className="ml-2" size="sm" />
  )
  const file = !_.isString(upload.body) && (
    <Alert color="success" className="col-12">
      Upload Success! We will send you an email when your import has finished.
      This may take a few days.
    </Alert>
  )
  return (
    <Row className="align-items-center">
      <Col xs={true} className="text-truncate text-monospace small text-muted">
        {name}
      </Col>
      <Col xs="auto">{spinnerOrDone}</Col>
      <Col xs="12" md="2">
        {upload.recipe && upload.recipe.html_url && (
          <Link route={upload.recipe.html_url}>
            <a className="btn btn-success btn-block">View</a>
          </Link>
        )}
      </Col>
      <AlertErrors errors={upload.errors} />
      {upload.success && file}
    </Row>
  )
}

const ImportsStatus = ({ uploads }: { uploads: ImportRequest[] }) => (
  <>
    <h3 className="my-3">Import Status</h3>
    <ListGroup flush>
      {uploads.map((u, key) => (
        <ListGroupItem key={key}>
          <ImportStatus upload={u} />
        </ListGroupItem>
      ))}
    </ListGroup>
  </>
)

interface ImportRecipeState {
  url: string
  uploads: {
    [key: string]: ImportRequest
  }
}

export default class ImportRecipe extends React.Component<
  any,
  ImportRecipeState
> {
  constructor(props: any) {
    super(props)
    this.state = {
      uploads: {},
      url: ''
    }
    this.onDrop = this.onDrop.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  public async onDrop(files: File[]) {
    const formData = new FormData()
    files.forEach(f => formData.append('file', f, f.name))
    const uploads = _.keyBy(
      _.map(files, body => ({
        id: uuid(),
        body
      })),
      'id'
    )
    this.setState(s => ({
      ...s,
      uploads: {
        ...s.uploads,
        ...uploads
      }
    }))

    try {
      await api.importFiles(formData)
      this.setState(s => ({
        ...s,
        uploads: {
          ...s.uploads,
          ..._.mapValues(uploads, u => ({
            ...u,
            ...{ success: true, done: true }
          }))
        }
      }))
    } catch (err) {
      this.setState(s => ({
        ...s,
        uploads: {
          ...s.uploads,
          ..._.mapValues(uploads, u => ({
            ...u,
            ...{ success: false, done: true, errors: getErrorMessages(err) }
          }))
        }
      }))
    }
  }

  public async onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { url } = this.state
    const upload = { body: url, id: uuid() }
    this.setState(s => ({
      url: '',
      uploads: {
        ...s.uploads,
        [upload.id]: upload
      }
    }))
    try {
      const recipe = await api.importUrl(url)
      this.setState(s => ({
        ...s,
        uploads: {
          ...s.uploads,
          [upload.id]: {
            ...s.uploads[upload.id],
            ...{ success: true, done: true, recipe }
          }
        }
      }))
    } catch (err) {
      this.setState(s => ({
        ...s,
        uploads: {
          ...s.uploads,
          [upload.id]: {
            ...s.uploads[upload.id],
            ...{ success: false, done: true, errors: getErrorMessages(err) }
          }
        }
      }))
    }
  }

  public render() {
    const uploads = _.values(this.state.uploads)
    return (
      <Layout>
        <Head>
          <title>Import Recipe</title>
        </Head>
        <Row className="mt-5 mb-3">
          <Col xs="12">
            <h2 className="mb-0">Import a new recipe</h2>
            <p className="text-muted">
              You can upload any type of file or a url.
            </p>
          </Col>
        </Row>
        <Form onSubmit={this.onSubmit}>
          <Row>
            <Col xs="12">
              <Dropzone onDrop={this.onDrop}>
                <div className="text-center font-weight-bold">
                  Drag and drop any files here
                </div>
                <div style={{ lineHeight: '3rem' }}>OR</div>
                <Button color="primary">Browse to find files</Button>
              </Dropzone>
            </Col>
          </Row>
          <p className="my-2">Or a URL to a recipe</p>
          <div className="d-none d-md-block">
            <InputGroup>
              <Input
                placeholder="Recipe URL to import..."
                type="text"
                name="url"
                id="url"
                required
                value={this.state.url}
                onChange={e => this.setState({ url: e.target.value })}
              />
              <InputGroupAddon addonType="append">
                <Button color="primary" type="submit">
                  Import recipe
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="d-md-none">
            <p>
              <Input
                placeholder="Recipe URL to import..."
                type="text"
                name="url"
                id="url"
                required
                value={this.state.url}
                onChange={e => this.setState({ url: e.target.value })}
              />
            </p>
            <Button color="primary" block type="submit">
              Import recipe
            </Button>
          </div>
        </Form>
        {uploads.length > 0 && <ImportsStatus uploads={uploads} />}
        <div className="mb-5" />
      </Layout>
    )
  }
}
