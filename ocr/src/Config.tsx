import * as React from 'react'
import { S3 } from 'aws-sdk'
import { map } from 'lodash'
import { ListGroup, ListGroupItem } from 'reactstrap'
const s3 = new S3()

const list = (): Promise<string[]> =>
  s3
    .listObjects({
      Bucket: 'com-platezero-recipes'
    })
    .promise()
    .then(res => map(res.Contents, 'Key'))

interface ConfigState {
  objects: string[]
}

export class Config extends React.Component<> {
  constructor(props: any) {
    super(props)

    this.state = {
      objects: []
    }
  }

  public async componentDidMount() {
    this.setState({
      objects: await list()
    })
  }

  public render() {
    console.log(this.state.objects)
    return (
      <div>
        <h2>Recipes to OCR</h2>
        <ListGroup flush>
          <ListGroupItem active tag="button" action>
            Item
          </ListGroupItem>
        </ListGroup>
      </div>
    )
  }
}
