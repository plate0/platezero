import * as React from 'react'
import * as _ from 'lodash'
import { Canvas } from './Canvas'
import { Recipe } from './Recipe'
import { Config } from './Config'
import { Navbar } from './Navbar'
import { Container, Row, Col } from 'reactstrap'
import { ocr } from './google'
import * as adapters from './adapters'
import { RecipeParts, MarkdownRecipe } from './models'
import * as Mousetrap from 'mousetrap'
import { transcribe } from './transcribe'
import { create } from './create'
import { writeFileSync } from 'fs'
const app = require('electron').remote.app

const recipeToJSON = (recipe: MarkdownRecipe): string => {
  let md = ``
  if (recipe.duration) {
    md += `
<meta itemprop="cookTime" content="${recipe.duration}"></meta>
`
  }
  if (recipe.yld) {
    md += `
<meta itemprop="recipeYield" content="${recipe.yld}"></meta>
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

${recipe.procedures}
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

interface AppState {
  recipe: MarkdownRecipe
  active: string
  recipePath?: string
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
      recipe: {
        title: '',
        subtitle: '',
        description: '',
        ingredients: '',
        procedures: '',
        yld: '',
        duration: ''
      },
      active: 'title'
    }
  }

  public componentDidMount() {
    // console.log('DATA PATH', app.getPath('userData'))
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

  public next(): boolean {
    let i = _.findIndex(RecipeParts, r => r.val === this.state.active)
    if (i == RecipeParts.length - 1) {
      i = 0
    } else {
      i++
    }
    this.setState({ active: RecipeParts[i].val })
    return false
  }

  public previous(): boolean {
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
      if (this.state.active === 'procedures') {
        val = this.state.recipe.procedures += ` ${val}`
      }
      return {
        ...s,
        recipe: {
          ...s.recipe,
          [this.state.active]: val
        }
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
      recipe: {
        ...s.recipe,
        [prop]: val
      }
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
    if (recipe.yld) {
      md += `
<meta itemprop="recipeYield" content="${recipe.yld}"></meta>
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

${recipe.procedures}
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
        procedures: '',
        yld: '',
        duration: ''
      })
    } catch (err) {
      alert(err)
    }
  }

  public render() {
    // TODO: "login" or get recipes from S3
    if (!this.state.recipePath) {
      return (
        <Container>
          <Config />
        </Container>
      )
    }
    return (
      <div>
        <Navbar active={this.state.active} onClick={this.onActiveChange} />
        <Row>
          <Col xs="9">
            <Canvas onSelection={this.onSelection} />
          </Col>
          <Col xs="3" style={{ maxHeight: '960px', overflow: 'auto' }}>
            <Recipe
              recipe={this.state.recipe}
              active={this.state.active}
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
