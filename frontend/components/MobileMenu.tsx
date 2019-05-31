import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { Button, Container, Navbar } from 'reactstrap'
import { Router } from '../routes'
import { FooterLinks } from './Footer'

export type CloseHandler = () => any

export const MobileMenu = ({
  isOpen,
  close
}: {
  isOpen: boolean
  close: CloseHandler
}) => {
  const { user } = useContext(UserContext)
  const NavRoutes = [
    { name: 'Recipes', route: 'user', params: { username: user.username } },
    { name: 'Shopping Lists', route: 'shopping' }
  ]
  const route = (route: string, params: any = {}) => () => {
    close()
    Router.pushRoute(route, params)
  }
  return (
    <div className="mobile menu">
      <Navbar>
        <Container className="p-0">
          <Button
            className="py-0 text-dark"
            color="link"
            onClick={close}
            style={{ fontSize: '1.5rem' }}
          >
            <i className="far fa-times" />
          </Button>
        </Container>
      </Navbar>
      <ul className="main-nav list-unstyled ml-4">
        {NavRoutes.map(r => (
          <li key={r.route}>
            <a
              href="javascript:void(0)"
              onClick={route(r.route, r.params)}
              className="text-dark"
            >
              <h2 className="m-0 py-4">{r.name}</h2>
            </a>
          </li>
        ))}
      </ul>
      <footer className="position-absolute">
        <ul className="list-unstyled ml-4">
          {FooterLinks.map(l => (
            <li>
              <a href={l.link} className="text-dark" target="_blank">
                <i className={`fal ${l.icon} fa-fw mr-2`} />
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      </footer>
      <style jsx>{`
        .mobile.menu {
          position: fixed;
          left: ${isOpen ? 0 : -380 + 'px'};
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
          transition: ease 250ms;
        }

        ul li {
          background-color: initial;
        }

        ul.main-nav li + li {
          border-top: 1px solid #343a40 !important;
        }

        footer {
          bottom: 0;
        }
      `}</style>
    </div>
  )
}
// window.innerWidth
