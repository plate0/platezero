import React, { useState, useRef, useEffect } from 'react'
import * as _ from 'lodash'

import { RecipeDurationJSON } from '../models'
import { DurationInput } from './DurationInput'

interface Props {
  duration: RecipeDurationJSON
  onChange?: (duration: RecipeDurationJSON) => any
}
export function RecipeDuration(props: Props) {
  const orig = useRef(props.duration)
  const [seconds, setSeconds] = useState(
    _.get(props.duration, 'duration_seconds')
  )
  const [model, setModel] = useState(props.duration)

  useEffect(() => {
    if (_.isUndefined(seconds)) {
      setModel(undefined)
    } else {
      const origSeconds = _.get(orig.current, 'duration_seconds')
      setModel({
        id: origSeconds === seconds ? _.get(orig.current, 'id') : undefined,
        duration_seconds: seconds
      })
    }
  }, [seconds])

  useEffect(() => {
    if (_.isFunction(props.onChange)) {
      props.onChange(model)
    }
  }, [model])

  const added = model && !orig.current
  const changed = model ? !model.id : false
  return (
    <DurationInput
      seconds={seconds}
      onChange={setSeconds}
      changed={changed}
      added={added}
    />
  )
}
