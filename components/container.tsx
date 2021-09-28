import cx, { Argument } from 'classnames'

const containerClass = 'container mx-auto'

interface Props extends React.ComponentPropsWithoutRef<'div'> {}

export const Container = ({ className, ...props }: Props) => (
  <div className={cx(containerClass, className)} {...props} />
)

export const asContainer = (c?: Argument) => cx(c, containerClass)
