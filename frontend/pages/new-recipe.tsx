import React from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import { Layout, ProfileHeader } from '../components'
import { getUser, createRecipe } from '../common/http'

interface NewRecipeProps {
  user: UserModel
}

interface Ingredient {
  quantity_numerator?: number
  quantity_denominator?: number
  name: string
  preparation: string
  optional: boolean
}

interface IngredientList {
  name: string
  ingredients: Ingredient[]
}

interface Procedure {
  name: string
  step: string[]
}

// Maps to req.body
interface NewRecipeState {
  title: string
  image_url: string
  source_url: string
  yield: string
  oven_preheat_temperature: string | number
  oven_preheat_unit: string
  sous_vide_preheat_temperature: number
  sous_vide_preheat_unit: string
  ingredient_lists: IngredientList[]
  procedure_lists: Procedure[]
}

export default class NewRecipe extends React.Component<
  NewRecipeProps,
  NewRecipeState
> {
  constructor(props: NewRecipeProps) {
    super(props)
    this.create = this.create.bind(this)
    this.state = {
      title: '',
      image_url: '',
      source_url: '',
      yield: '',
      oven_preheat_temperature: '',
      oven_preheat_unit: 'F',
      sous_vide_preheat_temperature: 0,
      sous_vide_preheat_unit: 'F',
      ingredient_lists: [
        {
          name: '',
          ingredients: [
            {
              quantity_numerator: 0,
              quantity_denominator: 0,
              name: '',
              preparation: ''
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
  static async getInitialProps({ query }) {
    const { username } = query
    return {
      user: await getUser(username)
    }
  }

  public async create(event: React.FormEvent<EventTarget>) {
    console.log('create!', this.state)
    event.preventDefault()
    const res = await createRecipe(this.state)
    console.log('Created!', res)
  }

  public setField = (field: string, val: string) => {
    this.setState({
      [field]: val
    })
  }

  public addIngredient = (i: number) => {
    this.setState(state => {
      const ingredients = state.ingredient_lists[i].ingredients
      ingredients.push({
        name: '',
        quantity_numerator: '',
        quantity_denominator: '',
        preparation: ''
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

  public render() {
    return (
      <Layout>
        <ProfileHeader {...this.props.user} />
        <Form onSubmit={this.create}>
          <FormGroup>
            <Label for="title">
              <strong>Title</strong>
            </Label>
            <Input
              type="text"
              name="title"
              id="title"
              required
              autoFocus={true}
              tabIndex={1}
              value={this.state.title}
              onChange={e => this.setField('title', e.currentTarget.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="image_url">
              <strong>Image URL</strong>
            </Label>
            <Input
              type="text"
              name="image_url"
              id="image_url"
              tabIndex={2}
              value={this.state.image_url}
              onChange={e => this.setField('image_url', e.currentTarget.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="source_url">
              <strong>Recipe Source (Where did you find this?)</strong>
            </Label>
            <Input
              type="text"
              name="source_url"
              id="source_url"
              tabIndex={3}
              value={this.state.source_url}
              onChange={e => this.setField('source_url', e.currentTarget.value)}
            />
          </FormGroup>
          <Row>
            <Col xs="3">
              <FormGroup>
                <Label for="oven_preheat_temperature">
                  <strong>Oven Preheat</strong>
                </Label>
                <Input
                  type="number"
                  name="oven_preheat_temperature"
                  id="oven_preheat_temperature"
                  tabIndex={4}
                  value={this.state.oven_preheat_temperature}
                  onChange={e =>
                    this.setField(
                      'oven_preheat_temperature',
                      e.currentTarget.value
                    )
                  }
                />
              </FormGroup>
            </Col>
          </Row>
          <h2>Ingredient Lists</h2>
          <Row>
            {this.state.ingredient_lists.map((il, i) => (
              <Col key={i} xs="12">
                <FormGroup>
                  <Label for={`procedure-${i}`}>
                    <strong>Ingredient List Name</strong>
                  </Label>
                  <Input
                    type="text"
                    name={`ingredient-list-${i}`}
                    id={`ingredient-list-${i}`}
                    value={this.state.ingredient_lists[i].name}
                    onChange={e => this.setField('', e.currentTarget.value)}
                  />
                </FormGroup>
                <h4>ingredients</h4>
                {il.ingredients.map((ingred, j) => (
                  <Input
                    key={j}
                    type="text"
                    value={ingred.name}
                    onChange={e => this.setField('', e.currentTarget.value)}
                  />
                ))}
                <Button type="button" onClick={e => this.addIngredient(i)}>
                  Add Another Ingredient
                </Button>
              </Col>
            ))}
          </Row>
          <h2>Steps</h2>
          <Row>
            {this.state.procedure_lists.map((p, i) => (
              <Col key={i} xs="12">
                <FormGroup>
                  <Label for={`procedure-${i}`}>
                    <strong>Step Name</strong>
                  </Label>
                  <Input
                    type="text"
                    name={`procedure-${i}`}
                    id={`procedure-${i}`}
                    value={this.state.procedure_lists[i].name}
                    onChange={e => this.setField('', e.currentTarget.value)}
                  />
                </FormGroup>
                {p.steps.map((pstep, j) => (
                  <Input
                    key={`pstep-${j}`}
                    type="textarea"
                    name="text"
                    id="exampleText"
                  />
                ))}
              </Col>
            ))}
          </Row>

          <Button type="button" onClick={this.addProcedureStep}>
            Add Another Step
          </Button>
          <Button type="submit" color="primary" className="btn-block">
            Create New Recipe!
          </Button>
        </Form>
      </Layout>
    )
  }
}
