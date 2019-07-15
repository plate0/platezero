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
        {FooterLinks.map(l => (
          <li key={l.name}>
            <a href={l.link}>
              <i className={`fal ${l.icon} fa-fw mr-2`} />
              {l.name}
            </a>
          </li>
        ))}
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
