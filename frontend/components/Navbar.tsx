import React from 'react'
import {
  Button,
  Collapse,
  NavbarToggler,
  Nav,
  Container,
  Navbar as RsNavbar
} from 'reactstrap'
import { ProfilePicture } from './ProfilePicture'
import { User } from '../models/user'
const {
  routes: { Link }
} = require('../routes')

export interface NavbarProps {
  user?: User
}

export interface NavbarState {
  isOpen: boolean
}

export class Navbar extends React.Component<NavbarProps, NavbarState> {
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
    const { user } = this.props
    const right = user ? (
      <Link route={`/${user.username}`} className="d-flex align-items-center">
        <a className="d-flex align-items-center nav-link rounded p-1">
          <span className="mr-2">{user.name}</span>
          <ProfilePicture img={user.avatar_url} size={30} />
          <style jsx>{`
            a {
              color: white !important;
              letter-spacing: 0.01rem;
            }
            a:hover {
              background-color: rgba(0, 0, 0, 0.1);
            }
          `}</style>
        </a>
      </Link>
    ) : (
      <Link route="/register">
        <Button outline color="primary">
          Sign Up
        </Button>
      </Link>
    )
    return (
      <RsNavbar expand="md" color="primary" dark={true} className="shadow-sm">
        <Container>
          <Link route="/">
            <a className="navbar-brand">PlateZero</a>
          </Link>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {right}
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
