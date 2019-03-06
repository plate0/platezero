import { Container } from 'reactstrap'
import { Navbar } from './Navbar'

export const Layout = props => (
  <div>
    <Navbar />
    <Container>{props.children}</Container>
  </div>
)
