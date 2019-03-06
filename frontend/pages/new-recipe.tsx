import React from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import Select from 'react-select'
import { Layout } from '../components'
import { getUser, createRecipe } from '../common/http'
import { UserJSON, RecipeJSON } from '../models'
import { AmountInput, NewRecipeTitle } from '../components'
import nextCookie from 'next-cookies'
import * as _ from 'lodash'

type SimpleProperty =
  | 'title'
  | 'image_url'
  | 'source_url'
  | 'oven_preheat_temperature'

const nullIfFalsey = (o: any): any => {
  if (o === '') {
    return undefined
  } else if (o === 0) {
    return null
  } else if (_.isPlainObject(o)) {
    return _.mapValues(o, nullIfFalsey)
  } else if (_.isArray(o)) {
    return _.map(o, nullIfFalsey)
  }
  return o
}

const Units = [
  { label: 'gram', value: 'g' },
  { label: 'milligram', value: 'mg' },
  { label: 'kilogram', value: 'kg' },
  { label: 'pound', value: 'lbs' },
  { label: 'cup', value: 'c' },
  { label: 'tablespoon', value: 'tbsp' },
  { label: 'teaspoon', value: 'tsp' },
  { label: 'liter', value: 'l' },
  { label: 'milliliter', value: 'ml' },
  { label: 'deciliter', value: 'dl' }
]

interface NewRecipeProps {
  user: UserJSON
  token: string
}

export default class NewRecipe extends React.Component<
  NewRecipeProps,
  RecipeJSON
> {
  constructor(props: NewRecipeProps) {
    super(props)
    this.create = this.create.bind(this)
    this.ingredientOnChange = this.ingredientOnChange.bind(this)
    this.ingredientListNameChange = this.ingredientListNameChange.bind(this)
    this.stepOnChange = this.stepOnChange.bind(this)
    this.state = {
      title: '',
      image_url: '',
      source_url: '',
      yield: '',
      preheats: [],
      ingredient_lists: [
        {
          name: '',
          ingredients: [
            {
              quantity_numerator: 1,
              quantity_denominator: 1,
              name: '',
              preparation: '',
              optional: false,
              unit: ''
            }
          ]
        }
      ],
      procedure_lists: [
        {
          name: '',
          steps: ['']
        }
      ]
    }
  }
  static async getInitialProps(ctx) {
    const {
      query: { username }
    } = ctx
    const { token } = nextCookie(ctx)
    return {
      user: await getUser(username, { token }),
      token
    }
  }

  public titleOnChange = (e: React.FormEvent<HTMLInputElement>) =>
    this.setState({
      title: e.currentTarget.value
    })

  public ingredientOnChange = (i: number, field: string, val: any) => {
    this.setState(state => {
      const ingredient = state.ingredient_lists[0].ingredients[i]
      ingredient[field] = val
      return state
    })
  }

  public async create(event: React.FormEvent<EventTarget>) {
    console.log('create!', this.state)
    console.log('token', this.props)
    const { token } = this.props
    event.preventDefault()
    const recipe = nullIfFalsey({ ...this.state })
    delete recipe.sous_vide_preheat_temperature
    console.log('Recipeeeee', recipe)
    try {
      const res = await createRecipe(recipe, { token })
      console.log('Created!', res)
    } catch (err) {
      console.log('ERROR CRREATIN RECIPE', err)
    }
  }

  public setField = (field: SimpleProperty, val: string) =>
    this.setState(state => ({
      ...state,
      ...{ [field]: val }
    }))

  public addIngredient = (i: number) => {
    this.setState(state => {
      const ingredients = state.ingredient_lists[i].ingredients
      ingredients.push({
        name: '',
        unit: '',
        quantity_numerator: 1,
        quantity_denominator: 1,
        preparation: '',
        optional: false
      })
      state.ingredient_lists[i].ingredients = ingredients
      return state
    })
  }

  public addProcedureStep = () => {
    console.log('add procedure step')
    this.setState(state => ({
      procedure_lists: [
        ...state.procedure_lists,
        {
          name: '',
          steps: ['']
        }
      ]
    }))
  }

  public ingredientListNameChange(i: number, val: string) {
    console.log('name change', i, val)
    this.setState(state => {
      console.log('state', i, state)
      const list = state.ingredient_lists[i]
      list.name = val
      return state
    })
  }

  public stepOnChange(listIndex: number, stepIndex: number, val: string) {
    this.setState(state => {
      state.procedure_lists[listIndex].steps[stepIndex] = val
      return state
    })
  }

  public procedureListNameChange(i: number, val: string) {
    this.setState(state => {
      state.procedure_lists[i].name = val
      return state
    })
  }

  public render() {
    return (
      <Layout user={this.props.user}>
        <Form onSubmit={this.create} className="mt-3">
          <Row>
            <Col xs="12">
              <NewRecipeTitle
                value={this.state.title}
                onChange={this.titleOnChange}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Ingredients</h2>
            </Col>
          </Row>
          {this.state.ingredient_lists[0].ingredients.map((ingredient, i) => (
            <Row>
              <Col xs="1">
                <FormGroup>
                  <Label for="amount" className="m-0">
                    <small>Amount</small>
                  </Label>
                  <AmountInput value={0} tabIndex={2 + i * 3} />
                </FormGroup>
              </Col>
              <Col xs="2">
                <FormGroup>
                  <Label for="unit" className="m-0">
                    <small>Unit</small>
                  </Label>
                  <Select
                    tabIndex={`${3 + i * 3}`}
                    name={`unit-${i}`}
                    id={`unit-${i}`}
                    options={Units}
                    value={_.find(Units, {
                      value: ingredient.unit
                    })}
                    onChange={(e: any) => {
                      console.log('SELECT ON CHANE', e)
                      this.ingredientOnChange(i, 'unit', e.value)
                    }}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        color: '#495057',
                        borderColor: state.isFocused ? '#7adaef' : '#ced4da',
                        boxShadow: state.isFocused
                          ? '0 0 0 0.2rem rgba(25, 175, 208, 0.25)'
                          : 'none',
                        '&:hover': {
                          borderColor: state.isFocused ? '#7adaef' : '#ced4da'
                        }
                      })
                    }}
                  />
                </FormGroup>
              </Col>
              <Col xs="2">
                <FormGroup>
                  <Label for="name" className="m-0">
                    <small>Name</small>
                  </Label>
                  <Input
                    type="text"
                    name={`name-${i}`}
                    id={`name-${i}`}
                    tabIndex={4 + i * 3}
                    value={this.state.ingredient_lists[0].ingredients[i].name}
                    onChange={e =>
                      this.ingredientOnChange(i, 'name', e.currentTarget.value)
                    }
                  />
                </FormGroup>
              </Col>
              <Col xs="6">
                <FormGroup>
                  <Label for="prep" className="m-0">
                    <small>Preperation</small>
                  </Label>
                  <Input type="text" name="" id="" tabIndex={5 + i * 3} />
                </FormGroup>
              </Col>
              <Col xs="1" className="d-flex align-items-center">
                <FormGroup check>
                  <Input type="checkbox" name={`optional-${i}`} />
                  <Label for={`optional-${i}`} className="m-0" check>
                    <small>Optional</small>
                  </Label>
                </FormGroup>
              </Col>
            </Row>
          ))}
          <Button
            type="button"
            outline
            color="secondary "
            onClick={() => this.addIngredient(0)}
          >
            Add Another Ingredient
          </Button>
          <h2 className="my-3">Steps</h2>
          <Row>
            {this.state.procedure_lists.map((p, i) => (
              <Col key={i} xs="12" className="mb-3">
                {p.steps.map((_, j) => (
                  <Input
                    key={`pstep-${j}`}
                    type="textarea"
                    name="text"
                    id="exampleText"
                    placeholder="Step by step instructions..."
                    value={this.state.procedure_lists[i].steps[j]}
                    onChange={e =>
                      this.stepOnChange(i, j, e.currentTarget.value)
                    }
                  />
                ))}
              </Col>
            ))}
          </Row>
          <Button
            type="button"
            outline
            color="secondary"
            onClick={this.addProcedureStep}
          >
            Add Another Step
          </Button>
          <Button type="submit" color="primary" className="btn-block my-3">
            Create New Recipe!
          </Button>
        </Form>
      </Layout>
    )
  }
}
