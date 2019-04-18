import React, { useState } from 'react'
import * as _ from 'lodash'
import { Input } from 'reactstrap'

export interface SearchProps {
  value?: string
  onChange: (search: string) => any
  className?: string
  placeholder?: string
}

export const Search = ({
  className,
  value,
  placeholder,
  onChange
}: SearchProps) => {
  let val = ''
  let setValue = undefined
  if (!_.isString(value)) {
    ;[val, setValue] = useState('')
  } else {
    val = value
  }
  const change = e => {
    const v = e.target.value
    if (setValue) {
      setValue(v)
    }
    onChange(v)
  }
  return (
    <Input
      className={className || ''}
      type="text"
      name="search"
      placeholder={placeholder}
      value={val}
      onChange={change}
    />
  )
}
