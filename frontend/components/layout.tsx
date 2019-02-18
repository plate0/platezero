import { Container } from 'reactstrap'
import { Navbar } from './Navbar'

export const Layout = props => (
  <div>
    <Navbar user={props.user} />
    <Container>{props.children}</Container>
  </div>
)
