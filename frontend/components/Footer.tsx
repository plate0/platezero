import React from 'react'
import { Container, Row, Col } from 'reactstrap'

export const Footer = () => (
  <footer className="text-muted bg-light d-flex mt-auto d-print-none">
    <Container className="align-items-center d-flex">
      <Row className="w-100">
        <Col xs="12" md="6">
          <ul className="mb-0 list-unstyled">
            <li>
              <a href="mailto:bugs@platezero.com">
                <i className="fal fa-bug fa-fw mr-2" />
                Report a bug
              </a>
            </li>
          </ul>
        </Col>
        <Col xs="12" md="6">
          <ul className="mb-0 list-unstyled">
            <li>
              <a href="mailto:hello@platezero.com">
                <i className="fal fa-envelope fa-fw mr-2" />
                Contact us
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
    <style jsx>
      {`
        footer {
          min-height: 200px;
        }

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
