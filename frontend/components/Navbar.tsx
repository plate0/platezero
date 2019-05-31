import React, { useContext } from 'react'
import {
  Button,
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

export interface NavbarProps {
  title: string
  root: boolean
  back: any
}

export const Navbar = ({ title, mobileMenuOpen, root, back }) => {
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
        {root && (
          <Button
            className="py-0 text-white d-block d-md-none"
            color="link"
            onClick={mobileMenuOpen}
          >
            <i style={{ fontSize: '1.5rem' }} className="far fa-bars" />
          </Button>
        )}
        {!root && (
          <Button
            className="pl-0 py-0 text-white d-md-none d-flex align-items-center link-never-underline"
            color="link"
            onClick={back}
          >
            <i className="far fa-chevron-left mr-2" />
            Back
          </Button>
        )}
        <Link route={user ? `/${user.username}` : '/'}>
          <a className="navbar-brand py-0 d-none d-md-block">
            <img src="/static/logo-reverse.png" alt="PlateZero" height="40" />
          </a>
        </Link>
        <div className="title text-white d-block d-md-none flex-fill text-center">
          {title}
        </div>
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
        <DropdownToggle nav caret className="py-0">
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
  <div className="d-none d-md-block">
    <Link route="shopping">
      <a className="text-white btn btn-link">Shopping</a>
    </Link>
    <Link route="new-recipe">
      <a className="add-recipe text-white btn btn-link" id="add-recipe">
        Add Recipe
      </a>
    </Link>
  </div>
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
