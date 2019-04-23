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
import { Dropzone, Layout } from '../components'
import * as _ from 'lodash'
import { api, PlateZeroApiError } from '../common'
import { RecipeJSON } from '../models'
import { Link } from '../routes'
import uuid from 'uuid/v4'

interface ImportRecipeState {
  url: string
  uploads: {
    [key: string]: ImportRequest
  }
}

const Source = [
  {
    text: 'Write it out',
    icon: 'pen',
    color: 'rgb(119, 192, 168)',
    link: '/recipes/new'
  },
  {
    text: 'From a website',
    icon: 'globe',
    color: 'rgb(58, 154, 217)',
    link: '/recipes/import/url'
  },
  {
    text: 'From a picture',
    icon: 'images',
    color: 'rgb(235, 113, 96)',
    link: '/recipes/import/file'
  },
  {
    text: 'From a PDF/Doc',
    icon: 'file-pdf',
    color: 'rgb(222, 77, 78)',
    link: '/recipes/import/file'
  },
  {
    text: 'Email it',
    icon: 'envelope',
    color: 'rgb(110, 158, 207)',
    link: 'mailto:importer@platezer.com'
  }
]

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

  onPaste = () => {
    navigator.clipboard.readText().then(alert)
  }

  public onPaste2 = (e: any) => {
    var clipboardData, pastedData

    // Stop data actually being pasted into div
    e.stopPropagation()
    e.preventDefault()

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData
    pastedData = clipboardData.getData('Text')

    // Do whatever with pasteddata
    alert(pastedData)
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
            ...{ success: false, done: true, errors: errMessages(err) }
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
            ...{ success: false, done: true, errors: errMessages(err) }
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
          <title>Add a new Recipe</title>
        </Head>
        <Row className="mt-5 mb-3">
          <Col xs="12">
            <h2 className="mb-0">Add a new Recipe</h2>
            <p className="text-muted">
              You can easily add a recipe in several ways.
            </p>
          </Col>
        </Row>
        <Row>
          {Source.map(s => (
            <Col xs="6" md="2" className="my-3">
              <Link to={s.link}>
                <a>
                  <div
                    className="p-3 text-center d-flex align-items-center flex-column border rounded"
                    style={{
                      boxShadow: '0 0 5px rgba(0, 0, 0, 0.1) inset'
                    }}
                  >
                    <i
                      className={`write fal fa-${s.icon} fa-4x rounded
          `}
                      style={{ color: s.color }}
                    />
                    <div className="mt-2">{s.text}</div>
                  </div>
                </a>
              </Link>
            </Col>
          ))}
        </Row>
        <style jsx>
          {`
            .import {
              height: 200px;
              background-color: rgb(248, 249, 250);
              border: 1px solid rgb(222, 226, 230);
              border-radius: 0.25rem;
              align-items: center;
              justify-content: center;
              display: flex;
              flex-direction: column;
            }

            a {
              color: #212529;
            }

            a:hover {
              text-decoration: none;
            }
          `}
        </style>
      </Layout>
    )
  }
}
