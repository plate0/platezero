import React, { useContext } from 'react'
import {
  Nav,
  NavItem,
  Container,
  Navbar as RsNavbar,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu
} from 'reactstrap'
import { UserJSON } from '../models'
import { UserContext } from '../context/UserContext'
import { Link } from '../routes'
import { ProfilePicture } from './ProfilePicture'

export const Navbar = () => {
  const { user } = useContext(UserContext)
  return (
    <RsNavbar expand={true} color="primary" dark={true} className="shadow-sm">
      <Container>
        <Link route="/">
          <a className="navbar-brand py-0">
            <img src="/static/logo-reverse.png" alt="PlateZero" height="40" />
          </a>
        </Link>
        <Nav className="ml-auto" navbar>
          {user && <NewRecipeDropdown />}
          {user ? <UserCardNav user={user} /> : <AnonNav />}
        </Nav>
      </Container>
    </RsNavbar>
  )
}

const UserCardNav = ({ user }: { user: UserJSON }) => (
  <>
    <NavItem>
      <Link route={`/${user.username}/recipes`}>
        <a className="btn btn-link text-light">Recipes</a>
      </Link>
    </NavItem>
    <NavItem>
      <Link route={`/${user.username}`}>
        <a className="d-block py-1 px-2">
          <ProfilePicture img={user.avatar_url} size={30} />
        </a>
      </Link>
    </NavItem>
  </>
)

const NewRecipeDropdown = () => (
  <UncontrolledDropdown>
    <DropdownToggle caret className="add-recipe text-white" color="link">
      <i className="fal fa-plus" />
    </DropdownToggle>
    <DropdownMenu right>
      <Link route="/recipes/new">
        <a className="dropdown-item text-dark" role="menuitem">
          New recipe
        </a>
      </Link>
      <Link route="/recipes/import">
        <a className="dropdown-item text-dark" role="menuitem">
          Import recipe
        </a>
      </Link>
    </DropdownMenu>
  </UncontrolledDropdown>
)

const AnonNav = () => (
  <>
    <NavItem>
      <Link route="/register">
        <a role="button" className="btn btn-link text-light">
          Sign Up
        </a>
      </Link>
    </NavItem>
    <NavItem>
      <Link route="/login">
        <a role="button" className="btn btn-link text-light">
          Log In
        </a>
      </Link>
    </NavItem>
  </>
)
