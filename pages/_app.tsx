import { ApolloProvider } from '@apollo/client'
import 'bootstrap/dist/css/bootstrap.css'
import type { AppProps } from 'next/app'
import { useClient } from 'queries'
import React from 'react'
import '../style/index.css'

function PlateZeroApp({ Component, pageProps }: AppProps) {
  const client = useClient()
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
export default PlateZeroApp
