import { useState } from 'react'
import { Badge, Button, Container, Nav, Navbar } from 'react-bootstrap'
import { MonitorPlay, Music2, Play, Share2, ShoppingCart } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import Cart from './Cart'
import useCart from '../hooks/useCart'

function Layout({ children }) {
  const [showCart, setShowCart] = useState(false)
  const { cartQuantity } = useCart()
  const location = useLocation()
  const isHomePage = location.pathname === '/' || location.pathname === '/index.html'

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
              <Nav.Link as={NavLink} to="/index.html" activeClassName="active">
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/store" activeClassName="active">
                Store
              </Nav.Link>
              <Nav.Link as={NavLink} to="/about.html" activeClassName="active">
                About
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contact-us" activeClassName="active">
                Contact Us
              </Nav.Link>
              <Nav.Link as={NavLink} to="/movies" activeClassName="active">
                Movies
              </Nav.Link>
              <Nav.Link as={NavLink} to="/login" activeClassName="active">
                Login
              </Nav.Link>
              <Nav.Link as={NavLink} to="/signup" activeClassName="active">
                Sign Up
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
          {isHomePage && (
            <div className="home-hero-actions">
              <Button variant="outline-light" className="latest-album-button">
                Get our Latest Album
              </Button>
              <Button
                aria-label="Play latest album"
                variant="outline-info"
                className="play-button"
              >
                <Play fill="currentColor" size={34} aria-hidden="true" />
              </Button>
            </div>
          )}
        </Container>
      </header>

      {children}

      <footer className="store-footer">
        <Container className="footer-content">
          <h2>The Generics</h2>
          <div className="social-links">
            <a href="https://www.youtube.com" aria-label="YouTube">
              <MonitorPlay size={28} aria-hidden="true" />
            </a>
            <a href="https://spotify.com" aria-label="Spotify">
              <Music2 size={28} aria-hidden="true" />
            </a>
            <a href="https://facebook.com" aria-label="Facebook">
              <Share2 size={28} aria-hidden="true" />
            </a>
          </div>
        </Container>
      </footer>
    </div>
  )
}

export default Layout
