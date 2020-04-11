import React from 'react'
import Head from 'next/head'
import { Layout } from '../components'

function errorHeader(code: number) {
  switch (code) {
    case 400:
      return 'What??'
    case 401:
      return 'Hey!'
    case 404:
      return 'That’s a 404'
  }
  return 'Error :('
}

function errorMessage(code: number) {
  switch (code) {
    case 400:
      return 'Your browser did something unexpected. Try again maybe?'
    case 401:
      return 'You’re not allowed to do that! Are you logged in?'
    case 404:
      return 'This is not the page you’re looking for.'
    case 500:
      return 'Something went wrong on our end, sorry about that! Shoot an email to bugs@platezero.com if the problem persists.'
  }
}

export default function ErrorPage({ statusCode }: { statusCode: number }) {
  return (
    <Layout className="my-5">
      <Head>
        <title>Error - PlateZero</title>
      </Head>
      <div className="text-center">
        <h1>{errorHeader(statusCode)}</h1>
        <p>{errorMessage(statusCode)}</p>
        <details>
          <summary>Technical details</summary>
          <p>
            Error code: <code>{statusCode}</code>
          </p>
        </details>
      </div>
    </Layout>
  )
}
