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
    console.log(user)
    const right = user ? (
      <div className="d-flex align-items-center">
        <span>{user.name}</span>
        <ProfilePicture img={user.avatar_url} size={30} />
      </div>
    ) : (
      <Link route="/register">
        <Button outline color="primary">
          Sign Up
        </Button>
      </Link>
    )
    return (
      <RsNavbar expand="md" className="shadow-sm navbar-light">
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
        </Container>
      </RsNavbar>
    )
  }
}
