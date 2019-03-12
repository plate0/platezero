import React from 'react'
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('./_import-recipe'), {
  ssr: false
})

export default () => (
  <div>
    <DynamicComponentWithNoSSR />
  </div>
)
