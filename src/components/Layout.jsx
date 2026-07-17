import { useCallback, useState } from 'react'
import { Badge, Button, Container, Nav, Navbar } from 'react-bootstrap'
import { MonitorPlay, Music2, Play, Share2, ShoppingCart } from 'lucide-react'
import { NavLink, useHistory, useLocation } from 'react-router-dom'
import Cart from './Cart'
import useAuth from '../hooks/useAuth'
import useCart from '../hooks/useCart'

function Layout({ children }) {
  const [showCart, setShowCart] = useState(false)
  const { isLoggedIn, logout } = useAuth()
  const { cartQuantity } = useCart()
  const history = useHistory()
  const location = useLocation()
  const isHomePage = location.pathname === '/' || location.pathname === '/index.html'

  const handleLogout = useCallback(() => {
    setShowCart(false)
    logout()
    history.replace('/login')
  }, [history, logout])

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
              <Nav.Link
                as={NavLink}
                to={isLoggedIn ? '/store' : '/login'}
                activeClassName="active"
              >
                Products
              </Nav.Link>
              <Nav.Link as={NavLink} to="/about.html" activeClassName="active">
                About
              </Nav.Link>
              {!isLoggedIn && (
                <Nav.Link as={NavLink} to="/login" activeClassName="active">
                  Login
                </Nav.Link>
              )}
              <Nav.Link as={NavLink} to="/contact-us" activeClassName="active">
                Contact Us
              </Nav.Link>
              <Nav.Link as={NavLink} to="/movies" activeClassName="active">
                Movies
              </Nav.Link>
              {isLoggedIn && (
                <Nav.Link as={NavLink} to="/profile" activeClassName="active">
                  Profile
                </Nav.Link>
              )}
            </Nav>
            {isLoggedIn && (
              <div className="account-actions">
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
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {isLoggedIn && <Cart onClose={() => setShowCart(false)} show={showCart} />}

      <header className="store-header">
        <Container>
          <h1>The Generics</h1>
          {isLoggedIn && isHomePage && (
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
