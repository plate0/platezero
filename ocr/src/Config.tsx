import * as React from 'react'
import { S3 } from 'aws-sdk'
import { toNumber, map } from 'lodash'
import { Row, Col, Button, ListGroup, ListGroupItem } from 'reactstrap'
import { archive } from './utils'
const s3 = new S3()

export interface RecipePath {
  key: string
  userId: number
}

const list = (): Promise<string[]> =>
  s3
    .listObjects({
      Bucket: 'com-platezero-recipes'
    })
    .promise()
    .then(res => map(res.Contents, 'Key') as string[])

const parse = (key: string): RecipePath => {
  const id = /^(\d+)\//gm.exec(key)![1]
  return {
    key,
    userId: toNumber(id || -1)
  }
}

const ConfigItem = ({
  r,
  onArchive,
  onSelect
}: {
  r: RecipePath
  onArchive: any
  onSelect: any
}) => (
  <ListGroupItem href="#" tag="a" action onClick={e => onSelect(r)}>
    <Row>
      <Col xs="11">{r.key}</Col>
      <Col xs="1">
        <Button
          color="danger"
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            onArchive(r.key)
          }}
        >
          Archive
        </Button>
      </Col>
    </Row>
  </ListGroupItem>
)

interface ConfigState {
  objects: RecipePath[]
}

interface ConfigProps {
  onSelect: (r: RecipePath) => any
}

export class Config extends React.Component<ConfigProps, ConfigState> {
  constructor(props: any) {
    super(props)
    this.state = {
      objects: []
    }
    this.onArchive = this.onArchive.bind(this)
  }

  public async componentDidMount() {
    this.refresh()
  }

  public async onArchive(key: string) {
    await archive(key)
    this.refresh()
  }

  public async refresh() {
    this.setState({
      objects: (await list()).map(parse)
    })
  }

  public render() {
    const { objects } = this.state
    return (
      <div>
        <h1 className="my-3 font-weight-light">
          {objects.length} Recipes to OCR
        </h1>
        <ListGroup flush style={{ maxHeight: 900, overflow: 'scroll' }}>
          {objects.map(o => (
            <ConfigItem
              r={o}
              key={o.key}
              onSelect={this.props.onSelect}
              onArchive={this.onArchive}
            />
          ))}
        </ListGroup>
      </div>
    )
  }
}
