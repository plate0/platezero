import React from 'react'

export const Blankslate = ({
  children,
  className
}: {
  children: any
  className?: string
}) => (
  <div
    className={[
      className || '',
      'bg-light',
      'rounded',
      'text-secondary',
      'd-flex',
      'flex-column',
      'text-center',
      'p-5',
      'align-items-center',
      'justify-content-center'
    ].join(' ')}
  >
    {children}
  </div>
)
