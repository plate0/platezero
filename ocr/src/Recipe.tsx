import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Row, Col, Button, Form, FormGroup, Input } from 'reactstrap'
import { MarkdownRecipe } from './models'

export interface RecipeProps {
  active: string
  recipe: MarkdownRecipe
  onChange: (prop: string, val: any) => any
  onSubmit: (recipe: MarkdownRecipe) => any
  onSubmitJSON: (recipe: MarkdownRecipe) => any
}

export class Recipe extends React.Component<RecipeProps> {
  private form = React.createRef<any>()
  private title = React.createRef<any>()
  private subtitle = React.createRef<any>()
  private description = React.createRef<any>()
  private ingredients = React.createRef<any>()
  private procedures = React.createRef<any>()
  private yld = React.createRef<any>()
  private duration = React.createRef<any>()

  constructor(props: RecipeProps) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  public onSubmit(e: React.FormEvent<EventTarget>) {
    e.preventDefault()
    this.props.onSubmit(this.props.recipe)
  }

  public render() {
    const { recipe } = this.props
    setTimeout(() => {
      const form: HTMLElement = ReactDOM.findDOMNode(
        this.form.current
      ) as HTMLElement
      const el = ReactDOM.findDOMNode(
        this[this.props.active].current
      ) as HTMLElement
      ;(form.parentNode as HTMLElement).scroll({
        top: el.offsetTop - 8,
        behavior: 'smooth'
      })
    })
    return (
      <Form className="p-2" ref={this.form} onSubmit={this.onSubmit}>
        <FormGroup>
          <Input
            className={`${this.props.active === 'title' ? 'focus' : ''}`}
            type="text"
            name="title"
            id="title"
            placeholder="Title"
            ref={this.title}
            required
            onFocus={e => this.props.onChange(e.target.name, e.target.value)}
            value={recipe.title}
            onChange={e => this.props.onChange(e.target.name, e.target.value)}
          />
        </FormGroup>
        <FormGroup className="mt-2">
          <Input
            className={`${this.props.active === 'subtitle' ? 'focus' : ''}`}
            type="text"
            name="subtitle"
            id="subtitle"
            placeholder="Subtitle"
            ref={this.subtitle}
            value={recipe.subtitle}
            onChange={e => this.props.onChange(e.target.name, e.target.value)}
          />
        </FormGroup>
        <FormGroup className="mt-2">
          <Input
            className={`${this.props.active === 'description' ? 'focus' : ''}`}
            type="textarea"
            name="description"
            id="description"
            placeholder="Description..."
            ref={this.description}
            value={recipe.description}
            onChange={e => this.props.onChange(e.target.name, e.target.value)}
            style={{ height: '300px' }}
          />
        </FormGroup>
        <FormGroup className="mt-2">
          <Input
            className={`${this.props.active === 'ingredients' ? 'focus' : ''}`}
            type="textarea"
            name="ingredients"
            id="ingredients"
            placeholder="Ingredients..."
            ref={this.ingredients}
            value={recipe.ingredients}
            onChange={e => this.props.onChange(e.target.name, e.target.value)}
            style={{ height: '300px' }}
          />
        </FormGroup>
        <FormGroup className="mt-2">
          <Input
            className={`${this.props.active === 'procedures' ? 'focus' : ''}`}
            type="textarea"
            name="procedures"
            id="procedures"
            placeholder="Instructions..."
            ref={this.procedures}
            value={recipe.procedures}
            onChange={e => this.props.onChange(e.target.name, e.target.value)}
            style={{ height: '300px' }}
          />
        </FormGroup>
        <FormGroup className="mt-2">
          <Input
            className={`${this.props.active === 'yld' ? 'focus' : ''}`}
            type="text"
            name="yld"
            id="yld"
            placeholder="Yields..."
            ref={this.yld}
            value={recipe.yld}
            onChange={e => this.props.onChange(e.target.name, e.target.value)}
          />
        </FormGroup>
        <FormGroup className="mt-2">
          <Input
            className={`${this.props.active === 'duration' ? 'focus' : ''}`}
            type="text"
            name="duration"
            id="duration"
            placeholder="Duration ISO..."
            ref={this.duration}
            value={recipe.duration}
            onChange={e => this.props.onChange(e.target.name, e.target.value)}
          />
        </FormGroup>
        <Row>
          <Col xs="6">
            <Button type="submit" color="primary">
              Submit
            </Button>
          </Col>
          <Col xs="6">
            <Button
              type="button"
              color="info"
              onClick={() => this.props.onSubmitJSON(this.props.recipe)}
            >
              Save To JSON
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
