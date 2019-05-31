import React from 'react'
import { Container } from 'reactstrap'

export const FooterLinks = [
  { name: 'Report a bug', icon: 'fa-bug', link: 'mailto:bugs@platezero.com' },
  {
    name: 'Contact us',
    icon: 'fa-envelope',
    link: 'mailto:hello@platezero.com'
  },
  { name: 'Blog', icon: 'fa-rss', link: 'https://blog.platezero.com' }
]

export const Footer = () => (
  <footer className="text-muted bg-light mt-auto d-print-none py-5 d-none d-md-block">
    <Container>
      <ul className="list-unstyled d-flex align-items-center justify-content-between mb-0">
        <li>
          <a href="mailto:bugs@platezero.com">
            <i className="fal fa-bug fa-fw mr-2" />
            Report a bug
          </a>
        </li>
        <li>
          <a href="mailto:hello@platezero.com">
            <i className="fal fa-envelope fa-fw mr-2" />
            Contact us
          </a>
        </li>
        <li>
          <a href="https://blog.platezero.com" target="_blank">
            <i className="fal fa-rss fa-fw mr-2" />
            Blog
          </a>
        </li>
      </ul>
    </Container>
    <style jsx>
      {`
        a {
          color: #6c757d;
        }

        a:hover {
          color: #004756;
          text-decoration: none;
        }
      `}
    </style>
  </footer>
)
