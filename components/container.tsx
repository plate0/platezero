import cx, { Argument } from 'classnames'
import React from 'react'

const containerClass = 'container mx-auto px-2'

interface Props extends React.ComponentPropsWithoutRef<'div'> {}

// return a regular function so it uses the name for the display name
const container = (Element: 'div' | 'main') =>
  function Container({ className, ...rest }: Props) {
    return <Element className={cx(containerClass, className)} {...rest} />
  }

export const Container = container('div')
export const Main = container('main')
export const asContainer = (c?: Argument) => cx(c, containerClass)
