import { ApolloProvider } from '@apollo/client'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useClient } from 'queries'
import React from 'react'
import 'tailwindcss/tailwind.css'

function PlateZeroApp({ Component, pageProps }: AppProps) {
  const client = useClient()
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  )
}
export default PlateZeroApp
