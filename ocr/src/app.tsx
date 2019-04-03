import * as React from 'react'
import * as _ from 'lodash'
import { Canvas } from './Canvas'
import { Recipe } from './Recipe'
import { Navbar } from './Navbar'
import { Row, Col } from 'reactstrap'
import { ocr } from './google'
import * as adapters from './adapters'
import { RecipeParts } from './models'
import * as Mousetrap from 'mousetrap'
import { transcribe } from './transcribe'
import { create } from './create'
import { writeFileSync } from 'fs'

const recipeToJSON = (recipe: Recipe): string => {
  let md = ``
  if (recipe.duration) {
    md += `
<meta itemprop="cookTime" content="${recipe.duration}"></meta>
`
  }
  if (recipe.yield) {
    md += `
<meta itemprop="recipeYield" content="${recipe.yield}"></meta>
`
  }
  md += `
# ${recipe.title}
`

  if (recipe.subtitle) {
    md += `
## ${recipe.subtitle}
`
  }

  if (recipe.description) {
    md += `
${recipe.description}
`
  }

  md += `
${recipe.ingredients}
    `

  md += `

${recipe.procedure}
    `

  const json = transcribe(md)
  if (!json.subtitle) {
    delete json['subtitle']
  }
  if (!json.description) {
    delete json['description']
  }
  return json
}

export class App extends React.Component {
  constructor(props: any) {
    super(props)

    this.onSelection = this.onSelection.bind(this)
    this.onRecipeChange = this.onRecipeChange.bind(this)
    this.onActiveChange = this.onActiveChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.saveToJSON = this.saveToJSON.bind(this)
    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this)
    this.state = {
      active: 'title',
      title: '',
      subtitle: '',
      description: '',
      ingredients: '',
      procedure: '',
      yield: '',
      duration: ''
    }
  }

  public componentDidMount() {
    Mousetrap.bind(
      [
        'command+t',
        'command+s',
        'command+d',
        'command+i',
        'command+o',
        'command+y',
        'command+u'
      ],
      ({ key }) => {
        this.shortcut(key)
      }
    )
    Mousetrap.bind('command+n', this.next)
    Mousetrap.bind('command+p', this.previous)
    Mousetrap.bind('esc', () => document.activeElement.blur())
  }

  public shortcut(key: string) {
    const active = _.first(_.filter(RecipeParts, { key }))
    if (active) {
      this.setState({ active: active.val })
    }
  }

  public next() {
    let i = _.findIndex(RecipeParts, r => r.val === this.state.active)
    if (i == RecipeParts.length - 1) {
      i = 0
    } else {
      i++
    }
    this.setState({ active: RecipeParts[i].val })
    return false
  }

  public previous() {
    let i = _.findIndex(RecipeParts, r => r.val === this.state.active)
    if (i == 0) {
      i = RecipeParts.length - 1
    } else {
      i--
    }
    this.setState({ active: RecipeParts[i].val })
    return false
  }

  public async onSelection(buffer: Buffer) {
    console.log('onSelection', this.state)
    const result = await ocr(buffer)
    const adapter = adapters[this.state.active]
    let val = adapter ? adapter(result) : result
    this.setState(s => {
      if (this.state.active === 'procedure') {
        val = this.state.procedure += ` ${val}`
      }
      return {
        ...s,
        [this.state.active]: val
      }
    })
    this.next()
  }

  // When the user directly edits the markdown
  public onRecipeChange(prop: string, val: any) {
    console.log('onRecipeChange', this.state)
    this.setState(s => ({
      ...s,
      active: prop,
      [prop]: val
    }))
  }

  public onActiveChange(active: string) {
    console.log('onActiveChange', this.state)
    this.setState({ active })
  }

  public async saveToJSON(recipe: Recipe) {
    const json = recipeToJSON(recipe)
    writeFileSync('recipe.json', JSON.stringify(json, null, 2))
  }

  public async onSubmit(recipe: Recipe) {
    console.log('make markdown')
    let md = ``
    if (recipe.duration) {
      md += `
<meta itemprop="cookTime" content="${recipe.duration}"></meta>
`
    }
    if (recipe.yield) {
      md += `
<meta itemprop="recipeYield" content="${recipe.yield}"></meta>
`
    }
    md += `
# ${recipe.title}
`

    if (recipe.subtitle) {
      md += `
## ${recipe.subtitle}
`
    }

    if (recipe.description) {
      md += `
${recipe.description}
`
    }

    md += `
${recipe.ingredients}
    `

    md += `

${recipe.procedure}
    `

    console.log(md)
    const json = transcribe(md)
    console.log('JSON', json)
    if (!json.subtitle) {
      delete json['subtitle']
    }
    if (!json.description) {
      delete json['description']
    }

    try {
      const created = await create(5, json)
      console.log('DONE!!!!!!!!!!', created)
      this.setState({
        active: 'title',
        title: '',
        subtitle: '',
        description: '',
        ingredients: '',
        procedure: '',
        yield: '',
        duration: ''
      })
    } catch (err) {
      alert(err)
    }
  }

  public render() {
    // TODO: "login" or get recipes from S3
    return (
      <div>
        <Navbar active={this.state.active} onClick={this.onActiveChange} />
        <Row>
          <Col xs="9">
            <Canvas onSelection={this.onSelection} />
          </Col>
          <Col xs="3" style={{ maxHeight: '960px', overflow: 'auto' }}>
            <Recipe
              {...this.state}
              onChange={this.onRecipeChange}
              onSubmit={this.onSubmit}
              onSubmitJSON={this.saveToJSON}
            />
          </Col>
        </Row>
      </div>
    )
  }
}
