import React, { useState } from 'react'
import { includes } from 'lodash'
import { Container } from 'reactstrap'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { MobileMenu } from './MobileMenu'
import { withRouter, WithRouterProps } from 'next/router'
import { titleForRoute } from '../routes'

export interface LayoutProps {
  title?: string
  fluid?: boolean
  children: any
  className?: string
}

const _Layout = (props: LayoutProps & WithRouterProps) => {
  console.log(props)
  const { router } = props
  const { asPath } = router
  const root = !includes(asPath.substring(1), '/')
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <>
      <div
        id="main"
        className={`d-flex flex-column ${menuOpen ? 'blur' : ''}`}
        style={{ minHeight: '100vh' }}
      >
        <Navbar
          root={root}
          title={props.title || titleForRoute(asPath)}
          mobileMenuOpen={() => setMenuOpen(true)}
          back={router.back}
        />
        <Container
          fluid={props.fluid}
          className={`${props.className ? props.className : ''}`}
        >
          {props.children}
        </Container>
        <Footer />
      </div>
      <MobileMenu isOpen={menuOpen} close={() => setMenuOpen(false)} />
    </>
  )
}

export const Layout = withRouter(_Layout)
