import React, { useState } from 'react'
import { Router } from '../routes'
import {
  Form,
  Input,
  InputGroup,
  Button,
  InputGroupAddon,
  Row,
  Col,
  Spinner
} from 'reactstrap'
import Head from 'next/head'
import { Link } from '../routes'
import { Layout, LoadProcedure, LoadIngredients, Back } from '../components'
import { PostRecipe } from '../common/request-models'
import { api, PlateZeroApiError, HttpStatus } from '../common'
import { size } from 'lodash'
import { IngredientListJSON, ProcedureListJSON } from '../models'

type MissingValue = 'ingredient_lists' | 'procedure_lists'

const Loading = () => (
  <div className="d-flex justify-content-center mt-5">
    <Spinner style={{ width: '3rem', height: '3rem' }} color="primary" />
  </div>
)

const NotShowing = ({ href }) => {
  const [show, setShow] = useState(true)
  return (
    <div
      className={`position-absolute rounded p-3 bg-light
        align-items-center d-flex justify-content-between
        ${show ? 'd-block' : 'd-none'}`}
      style={{ left: '1rem', right: '1rem', bottom: '1rem' }}
    >
      <p className="mb-0">
        Don't see the website? Some sites won't load. Click{' '}
        <a href={href} target="_blank">
          here
        </a>{' '}
        to open the site in a new tab and copy from there.
      </p>
      <Button color="link" onClick={() => setShow(false)}>
        <i className="fal fa-times-circle" />
      </Button>
    </div>
  )
}

const UrlForm = ({ onSubmit }) => {
  const [value, setValue] = useState('')
  return (
    <Form onSubmit={e => onSubmit(e, value)}>
      <InputGroup>
        <Input
          placeholder="Recipe URL to import..."
          autoFocus
          type="text"
          name="url"
          id="url"
          required
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <InputGroupAddon addonType="append">
          <Button color="primary" type="submit">
            Import recipe
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </Form>
  )
}

const Foo = ({ src }) => {
  return (
    <div className="position-relative">
      <iframe src={src} className="w-100" style={{ height: '50vh' }} />
      <NotShowing href={src} />
    </div>
  )
}

const Bar1 = ({ src }) => {
  return (
    <span>
      {' '}
      Please copy the ingredients from the{' '}
      <a href={src} target="_blank">
        website above
      </a>
      .{' '}
    </span>
  )
}

const Bar2 = ({ src }) => {
  return (
    <span>
      {' '}
      Please copy the instructions from the{' '}
      <a href={src} target="_blank">
        website above
      </a>
      .{' '}
    </span>
  )
}

interface ImportURLState {
  url: string
  recipe?: PostRecipe
  ingredient_lists?: IngredientListJSON
  procedure_lists?: ProcedureListJSON
  errors?: string[]
}

export default class ImportURL extends React.Component<any, ImportURLState> {
  constructor(props: any) {
    super(props)
    this.state = {
      url: ''
    }
    this.onUrl = this.onUrl.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  public async onUrl(e: any, url: string) {
    e.preventDefault()
    this.setState({ url })
    try {
      const recipe = await api.importUrl(url)
      Router.push(recipe.html_url)
    } catch (error) {
      if (
        error instanceof PlateZeroApiError &&
        error.statusCode == HttpStatus.UnprocessableEntity
      ) {
        this.setState({
          recipe: await error.res.json()
        })
      } else {
        this.setState({
          errors: error.messages
        })
      }
    }
  }

  public onChange(prop: MissingValue, data: any) {
    this.setState(s => ({
      ...s,
      [prop]: data
    }))
  }

  public onSubmit(prop: MissingValue) {
    this.setState(
      s => ({
        ...s,
        recipe: {
          ...s.recipe,
          [prop]: s[prop]
        }
      }),
      () => {
        if (prop === 'procedure_lists') {
          this.create()
        }
      }
    )
  }

  public async create() {
    this.setState({ errors: [] })
    const recipe = this.state.recipe
    try {
      const res = await api.createRecipe(recipe)
      Router.push(res.html_url)
    } catch (err) {
      if (err instanceof PlateZeroApiError) {
        this.setState({ errors: err.messages })
      }
    }
  }

  public render() {
    let inner = <Loading />
    if (!this.state.url) {
      inner = (
        <>
          <UrlForm onSubmit={this.onUrl} />
          <Link route="new-recipe">
            <a className="btn btn-link text-dark mt-3">
              <i className="far fa-chevron-double-left mr-2" />
              Cancel and go back
            </a>
          </Link>
        </>
      )
    }
    if (this.state.recipe && size(this.state.recipe.ingredient_lists) == 0) {
      inner = (
        <LoadIngredients
          src={this.state.url}
          disabled={size(this.state.ingredient_lists) === 0}
          onChange={i => this.onChange('ingredient_lists', i)}
          onSubmit={() => this.onSubmit('ingredient_lists')}
          Sample={Foo}
          Instructions={Bar1}
          back={'new-recipe'}
        />
      )
    } else if (
      this.state.recipe &&
      size(this.state.recipe.procedure_lists) == 0
    ) {
      inner = (
        <LoadProcedure
          src={this.state.url}
          onChange={p => this.onChange('procedure_lists', p)}
          onSubmit={() => this.onSubmit('procedure_lists')}
          Sample={Foo}
          Instructions={Bar2}
          back={'new-recipe'}
        />
      )
    }

    return (
      <Layout>
        <Head>
          <title>Add a recipe from a Website</title>
        </Head>
        <Row className="mt-5 mb-3">
          <Col xs="12">
            <h2 className="mb-0">Add a recipe from a website </h2>
          </Col>
        </Row>
        <Row>
          <Col xs="12">{inner}</Col>
        </Row>
      </Layout>
    )
  }
}
