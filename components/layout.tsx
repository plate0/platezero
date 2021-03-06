import { includes } from 'lodash'
import { WithRouterProps } from 'next/dist/client/with-router'
import { withRouter } from 'next/router'
import React, { useState } from 'react'
import { Container } from 'reactstrap'
import { titleForRoute } from '../routes'
import { Footer } from './Footer'
import { MobileMenu } from './MobileMenu'
import { Navbar } from './Navbar'

export interface LayoutProps {
  title?: string
  fluid?: boolean
  children: any
  className?: string
}

const _Layout = (props: LayoutProps & WithRouterProps) => {
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
