import React, { useRef, useState, useEffect } from 'react'
import * as _ from 'lodash'
import { Row, Col, Input } from 'reactstrap'

interface Props<T> {
  initialData: T
  dataToText: (data: T) => string
  textToData: (text: string) => T
  differ?: (orig: T, curr: T) => T
  preview: (data: T) => any
  onChange?: (data: T) => any
  formattingTips?: any
  placeholder?: string
  hasPreview?: (data: T) => boolean
  blankslate: any
  minHeight?: any
}

export function LivePreviewEditor<T>(props: Props<T>) {
  const orig = useRef(props.initialData)
  const [text, setText] = useState(props.dataToText(props.initialData))
  const [data, setData] = useState(props.initialData)

  useEffect(() => {
    setData(props.textToData(text))
  }, [text])

  useEffect(() => {
    if (_.isFunction(props.onChange)) {
      if (_.isFunction(props.differ)) {
        props.onChange(props.differ(orig.current, data))
      } else {
        props.onChange(data)
      }
    }
  }, [data])

  const hasPreview = _.isFunction(props.hasPreview)
    ? props.hasPreview(data)
    : !!data

  return (
    <Row>
      <Col xs="12" sm="6">
        <Input
          type="textarea"
          style={{ minHeight: props.minHeight }}
          placeholder={props.placeholder || ''}
          value={text}
          onChange={e => setText(e.target.value)}
        />
        {props.formattingTips && (
          <details>
            <summary>Formatting Tips</summary>
            {props.formattingTips}
          </details>
        )}
      </Col>
      <Col xs="12" sm="6">
        {hasPreview ? props.preview(data) : props.blankslate}
      </Col>
    </Row>
  )
}
