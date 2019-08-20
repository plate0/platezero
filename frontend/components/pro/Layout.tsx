import React from 'react'
import { Container, Navbar } from 'reactstrap'
import { Link } from '../../routes'

export const NavBar = ({}) => (
  <Navbar className="p-3" color="primary">
    <Container>
      <Link route="/pro">
        <a>
          <img
            src="https://static.platezero.com/assets/logo/platezero-pro-white.png"
            alt="PlateZero Pro"
            style={{ width: 180 }}
          />
        </a>
      </Link>
    </Container>
  </Navbar>
)

export const Layout = ({ children }) => (
  <>
    <NavBar />
    <Container>{children}</Container>
  </>
)
