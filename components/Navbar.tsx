import Link from 'next/link'
import React, { useContext } from 'react'
import { Button, Container, Nav, Navbar as RsNavbar, NavItem } from 'reactstrap'
import { UserContext } from '../context/UserContext'
import { UserJSON } from '../models'
import { ProfilePicture } from './ProfilePicture'

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
      className="shadow-sm px-2"
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
        <Link href={user ? `/${user.username}` : '/'}>
          <a className="navbar-brand py-0 d-none d-md-block">
            <img
              src="/static/logo-reverse.png"
              alt="PlateZero"
              className="w-28"
            />
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
  <Link href={`/${user.username}`}>
    <a>
      <ProfilePicture img={user.avatar_url} size={30} />
    </a>
  </Link>
)

const NewRecipeDropdown = () => (
  <div className="d-none d-md-block">
    <Link href="new-recipe">
      <a className="add-recipe text-white btn btn-link" id="add-recipe">
        Add Recipe
      </a>
    </Link>
  </div>
)

const AnonNav = () => (
  <>
    <NavItem>
      <Link href="/register">
        <a role="button" className="btn btn-link text-light">
          Sign Up
        </a>
      </Link>
    </NavItem>
    <NavItem>
      <Link href="/login">
        <a role="button" className="btn btn-link text-light">
          Log In
        </a>
      </Link>
    </NavItem>
  </>
)
