import * as React from 'react'
import * as _ from 'lodash'
import { Canvas } from './Canvas'
import { Recipe } from './Recipe'
import { Navbar } from './Navbar'
import { Row, Col } from 'reactstrap'
import { ocr } from './google'
import * as adapters from './adapters'
import { RecipeParts } from './models'

export class App extends React.Component {
  constructor(props: any) {
    super(props)

    this.onSelection = this.onSelection.bind(this)
    this.onRecipeChange = this.onRecipeChange.bind(this)
    this.onActiveChange = this.onActiveChange.bind(this)
    this.state = {
      active: 'title',
      title: '',
      subtitle: '',
      description: ''
    }
  }

  public componentDidMount() {
    window.addEventListener(
      'keyup',
      e => {
        console.log('TEST', e)
      },
      true
    )
    window.onkeyup = e => {
      console.log(e)
      e.preventDefault()
      e.stopPropagation()
      const { ctrlKey, key } = e
      if (!ctrlKey) {
        return false
      }
      if (key === 'n') {
        return this.next()
      } else if (key === 'p') {
        return this.previous()
      }
      const active = RecipeParts.filter(r => r.key === key)[0]
      if (active) {
        this.setState({ active: active.val })
      }
      return false
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
    const val = adapter ? adapter(result) : result
    this.setState({ [this.state.active]: val })
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
            <Recipe {...this.state} onChange={this.onRecipeChange} />
          </Col>
        </Row>
      </div>
    )
  }
}
