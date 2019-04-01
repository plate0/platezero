import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Canvas } from './Canvas'

export class App extends React.Component<undefined, undefined> {
  constructor(props) {
    super(props)
  }

  public render() {
    return (
      <div>
        <h2>Welcome to React with Typescript!</h2>
        <button onClick={this.export}>Export</button>
        <Canvas />
      </div>
    )
  }
}
