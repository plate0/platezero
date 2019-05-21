import React, { useContext } from 'react'
import {
  Nav,
  NavItem,
  Container,
  Navbar as RsNavbar,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from 'reactstrap'
import { UserJSON } from '../models'
import { UserContext } from '../context/UserContext'
import { Link } from '../routes'
import { ProfilePicture } from './ProfilePicture'
import { logout } from '../common'

export const Navbar = () => {
  const { user } = useContext(UserContext)
  return (
    <RsNavbar
      expand={true}
      color="primary"
      dark={true}
      className="shadow-sm"
      style={{ zIndex: 1 }}
    >
      <Container>
        <Link route={user ? `/${user.username}` : '/'}>
          <a className="navbar-brand py-0">
            <img src="/static/logo-reverse.png" alt="PlateZero" height="40" />
          </a>
        </Link>
        <Nav className="ml-auto align-items-center" navbar>
          {user && <NewRecipeDropdown />}
          {user ? <UserCardNav user={user} /> : <AnonNav />}
        </Nav>
      </Container>
    </RsNavbar>
  )
}

const UserCardNav = ({ user }: { user: UserJSON }) => (
  <UserContext.Consumer>
    {({ updateUser }) => (
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav caret>
          <ProfilePicture img={user.avatar_url} size={30} />
        </DropdownToggle>
        <DropdownMenu right>
          <Link route={`/${user.username}`}>
            <a className="dropdown-item" role="menuitem">
              Recipes
            </a>
          </Link>
          <DropdownItem
            onClick={() => {
              logout()
              const w = window as any
              if (w && w._paq) {
                w._paq.push(['resetUserId'])
                w._paq.push(['trackPageView'])
              }
              updateUser(null)
            }}
          >
            Logout
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )}
  </UserContext.Consumer>
)

const NewRecipeDropdown = () => (
  <Link route="new-recipe">
    <a className="add-recipe text-white btn btn-link" id="add-recipe">
      Add Recipe
    </a>
  </Link>
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
