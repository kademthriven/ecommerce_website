import { useState } from 'react'
import { Badge, Button, Container, Nav, Navbar } from 'react-bootstrap'
import { ShoppingCart } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import Cart from './Cart'
import useCart from '../hooks/useCart'

function Layout() {
  const [showCart, setShowCart] = useState(false)
  const { cartQuantity } = useCart()

  return (
    <div className="store-page">
      <Navbar expand="lg" className="store-nav" variant="dark">
        <Container>
          <Navbar.Brand as={NavLink} className="fw-bold text-uppercase" to="/">
            The Generics
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="store-navigation" />
          <Navbar.Collapse id="store-navigation">
            <Nav className="mx-auto">
              <Nav.Link as={NavLink} to="/" end>
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/store">
                Store
              </Nav.Link>
              <Nav.Link as={NavLink} to="/about.html">
                About
              </Nav.Link>
            </Nav>
            <Button
              aria-label="Open cart"
              variant="outline-light"
              className="cart-preview"
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart size={18} aria-hidden="true" />
              <span>Cart</span>
              <Badge bg="light" text="dark">
                {cartQuantity}
              </Badge>
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Cart onClose={() => setShowCart(false)} show={showCart} />

      <header className="store-header">
        <Container>
          <h1>The Generics</h1>
        </Container>
      </header>

      <Outlet />

      <footer className="store-footer">
        <Container>
          <h2>The Generics</h2>
        </Container>
      </footer>
    </div>
  )
}

export default Layout
