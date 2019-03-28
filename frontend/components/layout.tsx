import React from 'react'
import { Container } from 'reactstrap'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export interface LayoutProps {
  fluid?: boolean
  children: any
  className?: string
}

export const Layout = (props: LayoutProps) => (
  <div>
    <Navbar />
    <Container
      fluid={props.fluid}
      className={`${props.className ? props.className : ''}`}
    >
      {props.children}
    </Container>
    <Footer />
  </div>
)
