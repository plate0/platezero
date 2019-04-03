import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Form, FormGroup, Input } from 'reactstrap'
import { Recipe as RecipeModel } from './models'

export interface RecipeProps extends RecipeModel {
  active: string
  onChange: (prop: string, val: any) => void
}

export class Recipe extends React.Component<RecipeProps> {
  constructor(props: RecipeProps) {
    super(props)

    this.form = React.createRef()
    this.title = React.createRef()
    this.subtitle = React.createRef()
    this.description = React.createRef()
    this.ingredients = React.createRef()
    this.procedure = React.createRef()
    this['yield'] = React.createRef()
    this.duration = React.createRef()
  }
  public render() {
    setTimeout(() => {
      const form = ReactDOM.findDOMNode(this.form.current)
      const el = ReactDOM.findDOMNode(this[this.props.active].current)
      // el.focus()
      form.parentNode.scroll({
        top: el.offsetTop - 8,
        behavior: 'smooth'
      })
    })
    return (
      <Form className="p-2" ref={this.form}>
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
            value={this.props.title}
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
            value={this.props.subtitle}
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
            value={this.props.description}
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
            value={this.props.ingredients}
            onChange={e => this.props.onChange(e.target.name, e.target.value)}
            style={{ height: '300px' }}
          />
        </FormGroup>
        <FormGroup className="mt-2">
          <Input
            className={`${this.props.active === 'procedure' ? 'focus' : ''}`}
            type="textarea"
            name="procedure"
            id="procedure"
            placeholder="Instructions..."
            ref={this.procedure}
            value={this.props.procedure}
            onChange={e => this.props.onChange(e.target.name, e.target.value)}
            style={{ height: '300px' }}
          />
        </FormGroup>
        <FormGroup className="mt-2">
          <Input
            className={`${this.props.active === 'yield' ? 'focus' : ''}`}
            type="text"
            name="yield"
            id="yield"
            placeholder="Yields..."
            ref={this['yield']}
            value={this.props.yield}
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
            value={this.props.duration}
            onChange={e => this.props.onChange(e.target.name, e.target.value)}
          />
        </FormGroup>
      </Form>
    )
  }
}
