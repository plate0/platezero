import React from 'react'
import nextCookie from 'next-cookies'
import {
  Label,
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
import { Dropzone, Layout } from '../components'
import * as parse from 'url-parse'
import * as _ from 'lodash'
import { importUrl, importFiles, PlateZeroApiError } from '../common'
import { RecipeJSON } from '../models'
import { Link } from '../routes'

interface ImportRequest {
  body: File | string
  done?: boolean
  success?: boolean
  recipe?: RecipeJSON
  errors?: string[]
}

const ImportsStatus = ({ uploads }: { uploads: ImportRequest[] }) => (
  <div>
    <h3 className="my-3">Import Status</h3>
    <ListGroup flush>
      {urls.map(u => (
        <ListGroupItem key={u.url}>
          <Row>
            <Col xs="11">
              <h4 className="m-0">{parse(u.url).hostname}</h4>
              <small className="text-muted">{u.url}</small>
              {u.errors ? (
                <Alert color="danger">{u.errors.join(' ')}</Alert>
              ) : (
                undefined
              )}
            </Col>
            {!u.done ? (
              <Col
                xs="1"
                className="align-items-center justify-content-center d-flex"
              >
                <Spinner color="info" />
              </Col>
            ) : (
              undefined
            )}
            {u.success ? (
              <Col
                xs="1"
                className="align-items-center justify-content-center d-flex"
              >
                <i className="far fa-check fa-2x text-success" />
              </Col>
            ) : (
              undefined
            )}
            {u.recipe ? (
              <Link route={u.recipe.html_url}>
                <a className="btn btn-success">View</a>
              </Link>
            ) : (
              undefined
            )}
          </Row>
        </ListGroupItem>
      ))}
    </ListGroup>
  </div>
)

interface ImportRecipeState {
  url: string
  uploads: ImportRequest[]
}

interface ImportRecipeProps {
  token: string
}

export default class ImportRecipe extends React.Component<
  ImportRecipeProps,
  ImportRecipeState
> {
  constructor(props: ImportRecipeProps) {
    super(props)
    this.state = {
      uploads: [],
      url: ''
    }
    this.onDrop = this.onDrop.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  static async getInitialProps(ctx) {
    const { token } = nextCookie(ctx)
    return { token }
  }

  public onDrop(files: any) {
    this.setState(state => ({
      ...state,
      files: [...state.files, files]
    }))
    /*
    const { token } = this.props
    const formData = new FormData()
    files.forEach(f => formData.append('file', f, f.name))
    try {
      await importFiles(formData, { token })
    } catch (err) {
      console.log(err)
    }
    */
  }

  public async onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { token } = this.props
    const { url, urls } = this.state
    const i = urls.length
    this.setState(s => ({
      urls: [...s.urls, { url }],
      url: ''
    }))
    try {
      const res = await importUrl(url, { token })
      this.setState(s => {
        const imprt = s.urls[i]
        imprt.success = true
        imprt.done = true
        imprt.recipe = res
        return s
      })
    } catch (err) {
      let messages = []
      if (err instanceof PlateZeroApiError) {
        messages = err.messages
      } else {
        messages = [err.message]
      }
      this.setState(s => {
        const imprt = s.urls[i]
        imprt.success = false
        imprt.done = true
        imprt.errors = messages
        return s
      })
    }
  }

  public render() {
    const { uploads } = this.state
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
              <Dropzone onDrop={this.onDrop} />
            </Col>
          </Row>
          <p className="my-2">Or a URL to a recipe</p>
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
        </Form>
        {uploads.length > 0 && <ImportsStatus uploads={uploads} />}
      </Layout>
    )
  }
}
