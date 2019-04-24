import React, { useState } from 'react'
import { Router } from '../routes'
import {
  Alert,
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
import {
  Layout,
  IngredientListsEditor,
  ProcedureListsEditor
} from '../components'
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

const LoadIngredients = ({ disabled, src, onChange, onSubmit }) => {
  return (
    <Row>
      <Col xs="12">
        <Alert color="danger">
          Sorry, the importer could not find the ingredients.
        </Alert>
        <iframe src={src} className="w-100" style={{ height: '50vh' }} />
      </Col>
      <Col xs="12">
        <h2>Oops, that didn&rsquo;t quite work.</h2>
        <p>
          Please copy the ingredients from the website above. Paste them into
          the text field below and edit them however you would like. When done,
          press <em>Save & Continue</em>.
        </p>
        <IngredientListsEditor lists={[]} onChange={onChange} />
      </Col>
      <Col xs="12" className="d-flex justify-content-between my-3">
        <a>Cancel and go back</a>
        <Button color="primary" onClick={onSubmit} disabled={disabled}>
          Save & Continue
        </Button>
      </Col>
    </Row>
  )
}

const LoadProcedure = ({ src, onChange, onSubmit }) => {
  return (
    <Row>
      <Col xs="12">
        <Alert color="danger">
          Sorry, the importer could not find the instructions.
        </Alert>
        <iframe src={src} className="w-100" style={{ height: '50vh' }} />
      </Col>
      <Col xs="12">
        <p>
          Please copy the instructions from the source above. Paste them into
          the text field below and edit them however you would like. When done,
          press 'Save & Continue'.
        </p>
        <ProcedureListsEditor lists={[]} onChange={onChange} />
      </Col>
      <Col xs="12" className="d-flex justify-content-between">
        <a>Cancel and go back</a>
        <Button color="primary" onClick={onSubmit}>
          Save & Continue
        </Button>
      </Col>
    </Row>
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
      inner = <UrlForm onSubmit={this.onUrl} />
    }
    if (this.state.recipe && size(this.state.recipe.ingredient_lists) == 0) {
      inner = (
        <LoadIngredients
          src={this.state.url}
          disabled={size(this.state.ingredient_lists) === 0}
          onChange={i => this.onChange('ingredient_lists', i)}
          onSubmit={() => this.onSubmit('ingredient_lists')}
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
