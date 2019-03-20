import React, { useState, useContext } from 'react'
import {
  Collapse,
  NavbarToggler,
  Nav,
  Container,
  Navbar as RsNavbar
} from 'reactstrap'
import { UserJSON } from '../models'
import { UserContext } from '../context/UserContext'
import { ProfilePicture } from './ProfilePicture'
import { Link } from '../routes'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const user = useContext(UserContext)
  return (
    <RsNavbar expand="md" color="primary" dark={true} className="shadow-sm">
      <Container>
        <Link route="/">
          <a className="navbar-brand py-0">
            <img src="/static/logo-reverse.png" alt="PlateZero" height="40" />
          </a>
        </Link>
        <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {user ? <UserCardNav user={user} /> : <AnonNav />}
          </Nav>
        </Collapse>
      </Container>
    </RsNavbar>
  )
}

const UserCardNav = ({ user }: { user: UserJSON }) => (
  <Link route={`/${user.username}`}>
    <a className="d-block p-1 rounded">
      <div className="d-flex align-items-center">
        <div className="text-white">
          {user.name ? user.name : user.username}
        </div>
        <div className="ml-2">
          <ProfilePicture img={user.avatar_url} size={30} />
        </div>
      </div>
      <style jsx>
        {`
          a:hover {
            text-decoration: none;
            background-color: rgba(255, 255, 255, 0.2);
          }
          div {
            letter-spacing: 0.01rem;
          }
        `}
      </style>
    </a>
  </Link>
)

const AnonNav = () => (
  <div>
    <Link route="/register">
      <a role="button" className="btn btn-link text-light">
        Sign Up
      </a>
    </Link>
    <Link route="/login">
      <a role="button" className="btn btn-link text-light">
        Log In
      </a>
    </Link>
  </div>
)
