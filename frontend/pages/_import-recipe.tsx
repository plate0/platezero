import React, { useCallback, useMemo } from 'react'
import nextCookie from 'next-cookies'
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
import { Layout } from '../components'
import { PlateZeroContext } from '../pages/_app'
import { useDropzone } from 'react-dropzone'
import * as parse from 'url-parse'
import { importUrl, PlateZeroApiError } from '../common'
import { RecipeJSON } from '../models'
const {
  routes: { Link }
} = require('../routes')

const baseStyle = {
  width: '100%',
  height: 200,
  backgroundColor: '#f8f9fa',
  //border: '1px solid #dee2e6',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: '#dee2e6',
  borderRadius: '0.25rem',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex'
}

const activeStyle = {
  borderColor: '#19afd0',
  boxShadow: '0 0 0 0.2rem rgba(60, 187, 215, 0.5)'
}

const acceptStyle = {
  borderStyle: 'solid',
  borderColor: '#00e676'
}

const Dropzone = ({ onDrop }: any) => {
  const cb = useCallback(files => {
    onDrop(files)
  }, [])
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept
  } = useDropzone({ onDrop: cb })

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {})
    }),
    [isDragActive]
  )

  return (
    <div {...getRootProps({ style })}>
      <input {...getInputProps()} className="bg-light" />
      <p className="m-0">
        Drag and drop some files here, or just click to select files
      </p>
    </div>
  )
}

const ImportsStatus = ({ urls }: { urls: UrlImport[] }) => {
  if (!urls || urls.length === 0) {
    return null
  }
  return (
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
}

interface UrlImport {
  url: string
  done?: boolean
  success?: boolean
  recipe?: RecipeJSON
  errors?: string[]
}

interface ImportRecipeState {
  token: string
  url: string
  urls: UrlImport[]
}

interface ImportRecipeProps {
  token: string
}

export default class ImportRecipe extends React.Component<
  ImportRecipeProps,
  ImportRecipeState
> {
  public static contextType = PlateZeroContext

  constructor(props: ImportRecipeProps) {
    super(props)
    this.onDrop = this.onDrop.bind(this)
    this.onUrlChange = this.onUrlChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    const { token } = nextCookie({})
    this.state = {
      url: '',
      urls: [],
      token
    }
  }

  // not working client side
  static async getInitialProps() {
    const { token } = nextCookie({})
    return { token }
  }

  public onDrop(files: any) {
    // TODO: Finish
    console.log(files)
    console.log(Dropzone)
  }

  public onUrlChange(e: React.FormEvent<HTMLInputElement>) {
    const url = e.currentTarget.value
    this.setState({ url })
  }

  public async onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { token, url, urls } = this.state
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
    return (
      <Layout>
        <Head>
          <title>Import Recipe</title>
        </Head>
        <h1 className="my-3 text-center">Importer</h1>
        <Form onSubmit={this.onSubmit}>
          <InputGroup>
            <Input
              placeholder="Recipe URL to import..."
              type="text"
              name="url"
              id="url"
              autoFocus={true}
              required
              tabIndex={1}
              value={this.state.url}
              onChange={this.onUrlChange}
            />
            <InputGroupAddon addonType="append">
              <Button color="primary" tabIndex={2}>
                Import
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Form>
        <ImportsStatus urls={this.state.urls} />
      </Layout>
    )
  }
}
