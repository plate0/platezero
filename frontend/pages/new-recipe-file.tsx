import { PostRecipe } from '../common/request-models'
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
import { api, getErrorMessages, PlateZeroApiError } from '../common'
import { Link } from '../routes'
import { UserJSON } from '../models'
import { HttpStatus } from '../common/http-status'
import * as _ from 'lodash'

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
  errorCode?: number
}

interface NewRecipeFileState {
  status: UploadStatus
  recipe?: PostRecipe
  text?: string[]
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
      text: [],
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
      const { httpStatus, recipe } = await api.importFiles(formData)
      if (httpStatus == HttpStatus.Created && recipe) {
        Router.push(recipe.html_url)
        return
      }
      this.setState({
        recipe,
        status: UploadStatus.UploadSucceeded
      })
    } catch (error) {
      if (
        error instanceof PlateZeroApiError &&
        error.statusCode == HttpStatus.UnprocessableEntity
      ) {
        const json = await error.res.json()
        const username = json.recipe.owner.username
        const slug = json.recipe.slug
        const recipe = await api.getRecipe(username, slug)

        const versionId = recipe.branches[0].recipe_version_id
        const version = await api.getRecipeVersion(username, slug, versionId)
        this.setState({
          recipe,
          version,
          text: json.text,
          status: UploadStatus.ParseFailed
        })
      } else {
        this.setState({
          status: UploadStatus.UploadFailed,
          errors: getErrorMessages(error)
        })
      }
    }
  }

  public onIlChange(data: any) {
    this.setState({ ingredientLists: data })
  }

  public onIlSubmit() {
    const { version, ingredientLists } = this.state
    version.ingredientLists = ingredientLists
    this.setState({ version })
    this.createIngredientLists()
  }

  public onPlChange(data: any) {
    this.setState({ procedureLists: data })
  }

  public onPlSubmit() {
    const { version, procedureLists } = this.state
    version.procedureLists = procedureLists
    this.setState({ version })
    this.createProcedureLists()
  }

  public createProcedureLists() {
    try {
      this.setState({ errors: [] })
      api.createProcedureLists(this.state.procedureLists, this.state.version.id)
    } catch (err) {
      console.error(`createProcedureLists: ${err}`)
      this.setState({ errors: getErrorMessages(err) })
    }
  }

  public async createIngredientLists() {
    try {
      this.setState({ errors: [] })
      await api.createIngredientLists(
        this.state.ingredientLists,
        this.state.version.id
      )
    } catch (err) {
      console.error(`createIngredientLists: ${err}`)
      this.setState({ errors: getErrorMessages(err) })
    }
  }

  private getMasterVersionId(): number {
    const masterVersionId = _.get(
      _.find(this.state.recipe.branches, { name: 'master' }),
      'recipe_version_id'
    )
    if (!masterVersionId) {
      throw new Error('Could not find master recipe version')
    }
    return masterVersionId
  }

  public render() {
    const { wording, errorCode } = this.props
    if (errorCode) {
      return <ErrorPage statusCode={errorCode} />
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
          <Col xs="12">{this.content()}</Col>
        </Row>
      </Layout>
    )
  }

  content() {
    const { status } = this.state
    const { user } = this.props
    switch (status) {
      case UploadStatus.None:
      default:
        return (
          <>
            <Dropzone onDrop={this.onDrop}>
              <div className="text-center font-weight-bold">
                Drag and drop any files here
              </div>
              <div style={{ lineHeight: '3rem' }}>OR</div>
              <Button color="primary">Browse to find files</Button>
            </Dropzone>
            <Back route="new-recipe" />
          </>
        )

      case UploadStatus.Uploading:
        return (
          <div className="d-flex justify-content-center">
            <Spinner color="primary" />
          </div>
        )

      case UploadStatus.ParseFailed:
        if (this.state.recipe) {
          let version = this.state.version
          if (
            size(version.ingredientLists) === 0 ||
            size(version.ingredientLists[0].lines) === 0
          ) {
            return (
              <LoadIngredients
                src={this.state.text}
                disabled={size(this.state.ingredientLists) === 0}
                onChange={i => this.onIlChange(i)}
                onSubmit={() => this.onIlSubmit()}
                Sample={Foo}
                Instructions={Bar1}
                back={'new-recipe'}
              />
            )
          } else if (
            size(version.procedureLists) === 0 ||
            size(version.procedureLists[0].lines) === 0
          ) {
            return (
              <LoadProcedure
                src={this.state.text}
                onChange={p => this.onPlChange(p)}
                onSubmit={() => this.onPlSubmit()}
                Sample={Foo}
                Instructions={Bar2}
                back={'new-recipe'}
              />
            )
          } else {
            Router.push(this.state.recipe.html_url)
          }
        }

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
              There was a problem uploading your files. Were you trying to
              upload too many? The maximum combined file size we currently
              accept is 100 megabytes, so if you're uploading a lot of recipes
              you may need to try using smaller batches.
            </p>
            <p>
              If you continue to have problems, please{' '}
              <a href="mailto:bugs@platezero.com">report a bug</a> and we'll
              take a look!
            </p>
            <AlertErrors errors={this.state.errors} />
          </>
        )
        break
    }
  }
}

const Foo = ({ src }) => {
  return (
    <div className="position-relative">
      <pre className="w-100" style={{ border: '1px solid #ced4da' }}>
        {`${src.join('\n')}`}
      </pre>
    </div>
  )
}

const Bar1 = ({ _src }) => {
  return <span> Please copy the ingredients from the text above . </span>
}

const Bar2 = ({ _src }) => {
  return <span> Please copy the instructions from the text above . </span>
}
