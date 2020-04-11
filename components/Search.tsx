import React from 'react'
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
  return (
    <Input
      className={className || ''}
      type="text"
      name="search"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  )
}
