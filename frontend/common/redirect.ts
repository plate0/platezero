import Router from 'next/router'

export const redirect = (res, Location) => {
  if (res) {
    res.writeHead(302, {
      Location
    })
    res.end()
  } else {
    Router.push('/pro/login')
  }
}
