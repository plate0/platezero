import React from 'react'
import { Container } from 'reactstrap'

export const Footer = () => (
  <footer className="text-muted bg-light d-flex mt-auto d-print-none py-5">
    <Container>
      <ul className="list-unstyled d-flex align-items-center justify-content-between">
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
