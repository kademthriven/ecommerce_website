import { useCallback, useState } from 'react'
import { Badge, Button, Container, Nav, Navbar } from 'react-bootstrap'
import { Globe, LogOut, ShoppingBag, ShoppingCart, UserRound } from 'lucide-react'
import { NavLink, useHistory, useLocation } from 'react-router-dom'
import Cart from './Cart'
import useAuth from '../hooks/useAuth'
import useCart from '../hooks/useCart'

function Layout({ children }) {
  const [showCart, setShowCart] = useState(false)
  const { isLoggedIn, logout } = useAuth()
  const { cartQuantity, loadCartItems } = useCart()
  const history = useHistory()
  const location = useLocation()
  const handleLogout = useCallback(() => {
    setShowCart(false)
    logout()
    history.replace('/')
  }, [history, logout])

  const handleOpenCart = useCallback(async () => {
    if (!isLoggedIn) {
      history.push('/login', { from: location.pathname })
      return
    }

    setShowCart(true)

    try {
      await loadCartItems()
    } catch {
      // Cart displays the request error in the panel.
    }
  }, [history, isLoggedIn, loadCartItems, location.pathname])

  return (
    <div className="store-page">
      <div className="announcement-bar">Free shipping on orders over $75 &middot; Easy 30-day returns</div>
      <Navbar expand="lg" className="store-nav" variant="light" sticky="top">
        <Container>
          <Navbar.Brand as={NavLink} className="store-brand" to="/">
            <span className="brand-mark"><ShoppingBag size={18} aria-hidden="true" /></span>
            NORTHSTAR
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="store-navigation" />
          <Navbar.Collapse id="store-navigation">
            <Nav className="mx-auto">
              <Nav.Link as={NavLink} exact to="/" activeClassName="active">
                Home
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/store"
                activeClassName="active"
              >
                Shop
              </Nav.Link>
              <Nav.Link as={NavLink} to="/about.html" activeClassName="active">
                About
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contact-us" activeClassName="active">
                Contact
              </Nav.Link>
              {isLoggedIn && (
                <Nav.Link as={NavLink} to="/profile" activeClassName="active">
                  Profile
                </Nav.Link>
              )}
            </Nav>
            <div className="account-actions">
              {isLoggedIn ? (
                <>
                  <Button as={NavLink} to="/profile" variant="link" className="nav-icon-button">
                    <UserRound size={19} aria-hidden="true" /> <span>Account</span>
                  </Button>
                  <Button variant="link" className="nav-icon-button" onClick={handleLogout}>
                    <LogOut size={18} aria-hidden="true" /> <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button as={NavLink} to="/login" variant="link" className="login-link">Log in</Button>
                  <Button as={NavLink} to="/signup" className="signup-nav-button">Sign up</Button>
                </>
              )}
              <Button aria-label="Open cart" variant="link" className="cart-preview" onClick={handleOpenCart}>
                <ShoppingCart size={20} aria-hidden="true" />
                <span className="d-none d-sm-inline">Cart</span>
                <Badge pill>{cartQuantity}</Badge>
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {isLoggedIn && <Cart onClose={() => setShowCart(false)} show={showCart} />}

      {children}

      <footer className="store-footer">
        <Container className="footer-content">
          <div><h2>NORTHSTAR</h2><p>Everyday goods, thoughtfully selected.</p></div>
          <div className="footer-links">
            <NavLink to="/store">Shop</NavLink>
            <NavLink to="/about">Our story</NavLink>
            <NavLink to="/contact-us">Contact</NavLink>
            <a href="https://instagram.com" aria-label="Visit Northstar on Instagram"><Globe size={20} /></a>
          </div>
        </Container>
      </footer>
    </div>
  )
}

export default Layout
