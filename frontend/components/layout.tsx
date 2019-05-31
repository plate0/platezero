import React, { useState } from 'react'
import { Container } from 'reactstrap'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { MobileMenu } from './MobileMenu'

export interface LayoutProps {
  fluid?: boolean
  children: any
  className?: string
}

export const Layout = (props: LayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <>
      <div
        id="main"
        className={`d-flex flex-column ${menuOpen ? 'blur' : ''}`}
        style={{ minHeight: '100vh' }}
      >
        <Navbar mobileMenuOpen={() => setMenuOpen(true)} />
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
