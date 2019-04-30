import React from 'react'
import ErrorPage from './_error'
import Head from 'next/head'
import { Dropzone, Layout } from '../components'
import { Spinner, Button, Row, Col } from 'reactstrap'
import * as _ from 'lodash'
import { api, PlateZeroApiError } from '../common'
import { Link } from '../routes'
import { UserJSON } from '../models'

enum UploadStatus {
  None,
  Uploading,
  Uploaded
}

const errMessages = (err: PlateZeroApiError | Error) => {
  let messages = []
  if (err instanceof PlateZeroApiError) {
    messages = err.messages
  } else {
    messages = [err.message]
  }
  return messages
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
  errors: string[]
}

export default class NewRecipeFile extends React.Component<
  NewRecipeFileProps,
  NewRecipeFileState
> {
  static async getInitialProps({ query, res }) {
    console.log(query)
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
      await api.importFiles(formData)
      this.setState({ status: UploadStatus.Uploaded })
    } catch (err) {
      this.setState({
        status: UploadStatus.Uploaded,
        errors: errMessages(err)
      })
    }
  }

  public render() {
    const { wording, user, statusCode } = this.props
    const { status } = this.state
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
          <Col xs="12">
            {status == UploadStatus.None && (
              <Link route="new-recipe">
                <a className="btn btn-link text-dark">
                  <i className="far fa-chevron-double-left mr-2" />
                  Cancel and go back
                </a>
              </Link>
            )}
            {status == UploadStatus.Uploading && (
              <div className="d-flex justify-content-center">
                <Spinner color="primary" />
              </div>
            )}
            {status == UploadStatus.Uploaded && (
              <div>
                <h4>Hurray! Your recipe has been uploaded.</h4>
                <p>
                  Your recipe will appear in your account shortly. We will send
                  an email to you when it is ready.
                </p>
                <div className="text-center">
                  <Link to={`/${user.username}/recipes`}>
                    <a className="btn btn-link">View My Recipes</a>
                  </Link>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Layout>
    )
  }
}
