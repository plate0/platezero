import React from 'react'
import Router from 'next/router'
import ErrorPage from './_error'
import Head from 'next/head'
import {
  Back,
  Dropzone,
  Layout,
  AlertErrors,
  LoadIngredients,
  LoadProcedure
} from '../components'
import { Spinner, Button, Row, Col } from 'reactstrap'
import { size } from 'lodash'
import { api, getErrorMessages } from '../common'
import { Link } from '../routes'
import { UserJSON } from '../models'
import { HttpStatus } from '../common/http-status'

enum UploadStatus {
  None,
  Uploading,
  UploadSucceeded,
  ParseFailed,
  UploadFailed
}

const wordings = {
  file: 'a file',
  image: 'an image',
  pdf: 'a PDF',
  doc: 'a document'
}

interface NewRecipeFileProps {
  wording: string
  user?: UserJSON
  statusCode?: number
}

interface NewRecipeFileState {
  status: UploadStatus
  recipe?: string
  errors?: string[]
}

export default class NewRecipeFile extends React.Component<
  NewRecipeFileProps,
  NewRecipeFileState
> {
  static async getInitialProps({ query, res }) {
    const { type } = query
    const wording = wordings[type] || wordings['file']
    try {
      return {
        wording,
        user: await api.getCurrentUser()
      }
    } catch (err) {
      const statusCode = err.statusCode || 500
      if (res) {
        res.statusCode = statusCode
      }
      return { wording, statusCode }
    }
  }

  constructor(props: NewRecipeFileProps) {
    super(props)
    this.state = {
      errors: [],
      recipe: null,
      status: UploadStatus.None
    }
    this.onDrop = this.onDrop.bind(this)
  }

  public async onDrop(files: File[]) {
    const formData = new FormData()
    files.forEach(f => formData.append('file', f, f.name))
    this.setState({
      status: UploadStatus.Uploading
    })
    try {
      const { httpStatus, recipe, text } = await api.importFiles(formData)
      if (httpStatus == HttpStatus.Created && recipe) {
        Router.push(recipe.html_url)
        return
      }
      this.setState({
        recipe,
        text,
        status:
          httpStatus == HttpStatus.UnprocessableEntity
            ? UploadStatus.ParseFailed
            : UploadStatus.UploadSucceeded
      })
    } catch (error) {
      this.setState({
        status: UploadStatus.UploadFailed,
        errors: getErrorMessages(error)
      })
    }
  }

  public render() {
    const { wording, user, statusCode } = this.props
    if (statusCode) {
      return <ErrorPage statusCode={statusCode} />
    }

    return (
      <Layout>
        <Head>
          <title>New recipe from {wording}</title>
        </Head>
        <Row className="mt-5 mb-3">
          <Col xs="12">
            <h2 className="mb-0">New recipe from {wording}</h2>
          </Col>
        </Row>
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
        <Row className="mt-3">
          <Col xs="12">{content(this.state, user)}</Col>
        </Row>
      </Layout>
    )
  }
}

function content(state: NewRecipeFileState, user: UserJSON) {
  const { status } = state
  switch (status) {
    case UploadStatus.None:
    default:
      return <Back route="new-recipe" />

    case UploadStatus.Uploading:
      return (
        <div className="d-flex justify-content-center">
          <Spinner color="primary" />
        </div>
      )

    case UploadStatus.ParseFailed:
      if (state.recipe) {
        if (size(state.recipe.ingredient_lists) == 0) {
          return (
            <LoadIngredients
              src={state.text}
              disabled={size(state.recipe.ingredient_lists) === 0}
              onChange={i => this.onChange('ingredient_lists', i)}
              onSubmit={() => this.onSubmit('ingredient_lists')}
              Sample={Foo}
              Instructions={Bar1}
              back={'new-recipe'}
            />
          )
        } else if (size(state.recipe.procedure_lists) == 0) {
          return (
            <LoadProcedure
              src={state.recipe}
              onChange={p => this.onChange('procedure_lists', p)}
              onSubmit={() => this.onSubmit('procedure_lists')}
              Sample={Foo}
              Instructions={Bar2}
              back={'new-recipe'}
            />
          )
        }
      }
    // Fall through...
    case UploadStatus.UploadSucceeded:
      return (
        <div>
          <h4>Hurray! Your recipe has been uploaded.</h4>
          <p>
            Your recipe will appear in your account shortly. We will send an
            email to you when it is ready.
          </p>
          <div className="text-center">
            <Link to={`/${user.username}`}>
              <a className="btn btn-link">View My Recipes</a>
            </Link>
          </div>
        </div>
      )
    case UploadStatus.UploadFailed:
      return (
        <>
          <h4 className="text-danger">That didn't work, sorry!</h4>
          <p>
            There was a problem uploading your files. Were you trying to upload
            too many? The maximum combined file size we currently accept is 100
            megabytes, so if you're uploading a lot of recipes you may need to
            try using smaller batches.
          </p>
          <p>
            If you continue to have problems, please{' '}
            <a href="mailto:bugs@platezero.com">report a bug</a> and we'll take
            a look!
          </p>
          <AlertErrors errors={state.errors} />
        </>
      )
      break
  }
}

const Foo = ({ src }) => {
  return (
    <div className="position-relative">
      <pre className="w-100" style={{ height: '50vh' }}>
        {src}
      </pre>
      }
    </div>
  )
}

const Bar1 = ({ _src }) => {
  return <span> Please copy the ingredients from the text above . </span>
}

const Bar2 = ({ _src }) => {
  return <span> Please copy the instructions from the text above . </span>
}
