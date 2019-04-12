import * as React from 'react'
import * as _ from 'lodash'
import { Canvas } from './Canvas'
import { Recipe } from './Recipe'
import { Navbar } from './Navbar'
import { Config, RecipePath } from './Config'
import { Container, Row, Col } from 'reactstrap'
import { ocr } from './google'
import * as adapters from './adapters'
import { RecipeParts, MarkdownRecipe } from './models'
import * as Mousetrap from 'mousetrap'
import { transcribe } from './transcribe'
import { parse } from 'path'
import { create } from './create'
import { writeFileSync } from 'fs'
import { toMarkdown } from './markdown'
import { download, convert } from './utils'
import log from 'electron-log'
const app = require('electron').remote.app

interface AppState {
  recipe: MarkdownRecipe
  active: string
  recipePath?: string
  userId?: number
}

export class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props)

    this.onSelectRecipe = this.onSelectRecipe.bind(this)
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
        duration: 0
      },
      active: 'title'
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

  public async onSelectRecipe(r: RecipePath) {
    log.info(r)
    const folder = app.getPath('userData')
    const path = await download(r.key, folder)
    const { base } = parse(path)
    const recipePath = await convert(folder, base)
    log.info('converted', recipePath)
    this.setState({
      recipePath,
      userId: r.userId
    })
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

  private transcribe(recipe: MarkdownRecipe): Recipe {
    const md = toMarkdown(recipe)
    const json = transcribe(md)
    if (!json.subtitle) {
      delete json['subtitle']
    }
    if (!json.description) {
      delete json['description']
    }
    return json
  }

  public async saveToJSON(recipe: MarkdownRecipe) {
    writeFileSync(
      'recipe.json',
      JSON.stringify(this.transcribe(recipe), null, 2)
    )
  }

  public async onSubmit(recipe: MarkdownRecipe) {
    const json = this.transcribe(recipe)
    try {
      const created = await create(5, json)
      console.log('DONE!!!!!!!!!!', created)
      this.setState({
        active: 'title',
        recipe: {
          title: '',
          subtitle: '',
          description: '',
          ingredients: '',
          procedures: '',
          yld: '',
          duration: 0
        }
      })
    } catch (err) {
      alert(err)
    }
  }

  public render() {
    const { recipePath } = this.state
    if (!recipePath) {
      return (
        <Container>
          <Config onSelect={this.onSelectRecipe} />
        </Container>
      )
    }

    return (
      <div>
        <Navbar active={this.state.active} onClick={this.onActiveChange} />
        <Row>
          <Col xs="9">
            <Canvas onSelection={this.onSelection} imagePath={recipePath} />
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
