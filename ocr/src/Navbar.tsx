import * as React from 'react'
import { Navbar as RsNavbar, Nav, NavItem, Button } from 'reactstrap'

export interface NavbarProps {
  active: string
  onClick: (active: string) => void
}

const buttons = [
  'title',
  'subtitle',
  'description',
  'ingredients',
  'procedure',
  'yield',
  'duration'
]

export class Navbar extends React.Component<> {
  public render() {
    return (
      <RsNavbar light>
        <Nav>
          {buttons.map((b, key) => (
            <NavItem key={key} className="ml-2">
              <Button
                outline
                name={b}
                size="sm"
                color="primary"
                active={this.props.active === b}
                onClick={e => this.props.onClick(e.target.name)}
              >
                {b}
              </Button>
            </NavItem>
          ))}
        </Nav>
      </RsNavbar>
    )
  }
}
