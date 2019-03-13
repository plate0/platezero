import React from 'react'
import {
  Button,
  Collapse,
  NavbarToggler,
  Nav,
  Container,
  Navbar as RsNavbar
} from 'reactstrap'
import { UserCard } from './UserCard'
import { PlateZeroContext } from '../pages/_app'
const {
  routes: { Link }
} = require('../routes')

export interface NavbarProps {}

export interface NavbarState {
  isOpen: boolean
}

export class Navbar extends React.Component<NavbarProps, NavbarState> {
  public static contextType = PlateZeroContext

  constructor(props: NavbarProps) {
    super(props)
    this.state = {
      isOpen: false
    }
    this.toggle = this.toggle.bind(this)
  }

  public toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  public render() {
    const { user } = this.context
    return (
      <RsNavbar expand="md" color="primary" dark={true} className="shadow-sm">
        <Container>
          <Link route="/">
            <a className="navbar-brand py-0">
              <img src="/static/logo-reverse.png" alt="PlateZero" height="40" />
            </a>
          </Link>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {user ? <UserCard user={user} compact={true} /> : <AnonNav />}
            </Nav>
          </Collapse>
          <style jsx>{`
            a {
              letter-spacing: 0.01rem;
            }
          `}</style>
        </Container>
      </RsNavbar>
    )
  }
}

const AnonNav = () => (
  <div>
    <Link route="/register">
      <Button color="link" className="text-light">
        Sign Up
      </Button>
    </Link>
    <Link route="/login">
      <Button color="link" className="text-light">
        Log In
      </Button>
    </Link>
  </div>
)
