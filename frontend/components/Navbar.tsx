import { Container, Navbar as RsNavbar } from 'reactstrap'
import Link from 'next/link'

export const Navbar = () => (
  <RsNavbar expand="md" className="shadow-sm">
    <Container>
      <Link href="/">
        <a className="navbar-brand">PlateZero</a>
      </Link>
    </Container>
  </RsNavbar>
)
