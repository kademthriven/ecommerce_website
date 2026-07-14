import { useState } from 'react'
import { Badge, Button, Card, Col, Container, Nav, Navbar, Row } from 'react-bootstrap'
import { ShoppingCart } from 'lucide-react'
import Cart from './components/Cart'
import './App.css'

const productsArr = [
  {
    title: 'Colors',
    price: 100,
    imageUrl: 'https://prasadyash2411.github.io/ecom-website/img/Album%201.png',
  },
  {
    title: 'Black and white Colors',
    price: 50,
    imageUrl: 'https://prasadyash2411.github.io/ecom-website/img/Album%202.png',
  },
  {
    title: 'Yellow and Black Colors',
    price: 70,
    imageUrl: 'https://prasadyash2411.github.io/ecom-website/img/Album%203.png',
  },
  {
    title: 'Blue Color',
    price: 100,
    imageUrl: 'https://prasadyash2411.github.io/ecom-website/img/Album%204.png',
  },
]

const cartElements = [
  {
    title: 'Colors',
    price: 100,
    imageUrl: 'https://prasadyash2411.github.io/ecom-website/img/Album%201.png',
    quantity: 2,
  },
  {
    title: 'Black and white Colors',
    price: 50,
    imageUrl: 'https://prasadyash2411.github.io/ecom-website/img/Album%202.png',
    quantity: 3,
  },
  {
    title: 'Yellow and Black Colors',
    price: 70,
    imageUrl: 'https://prasadyash2411.github.io/ecom-website/img/Album%203.png',
    quantity: 1,
  },
]

function App() {
  const [showCart, setShowCart] = useState(false)
  const [cartItems, setCartItems] = useState(cartElements)

  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleRemoveCartItem = (title) => {
    setCartItems((currentCartItems) =>
      currentCartItems.filter((item) => item.title !== title),
    )
  }

  return (
    <div className="store-page">
      <Navbar expand="lg" className="store-nav" variant="dark">
        <Container>
          <Navbar.Brand className="fw-bold text-uppercase" href="#">
            The Generics
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="store-navigation" />
          <Navbar.Collapse id="store-navigation">
            <Nav className="mx-auto">
              <Nav.Link href="#" className="active">
                Home
              </Nav.Link>
              <Nav.Link href="#">Store</Nav.Link>
              <Nav.Link href="#">About</Nav.Link>
            </Nav>
            <Button
              aria-label="Open cart"
              variant="outline-light"
              className="cart-preview"
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart size={18} aria-hidden="true" />
              <span>Cart</span>
              <Badge bg="light" text="dark">{cartQuantity}</Badge>
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Cart
        cartItems={cartItems}
        onClose={() => setShowCart(false)}
        onRemove={handleRemoveCartItem}
        show={showCart}
      />

      <header className="store-header">
        <Container>
          <h1>The Generics</h1>
        </Container>
      </header>

      <main className="products-section">
        <Container>
          <div className="section-heading">
            <p className="text-uppercase fw-semibold">Music</p>
            <h2>Featured Albums</h2>
          </div>

          <Row className="g-4 justify-content-center">
            {productsArr.map((product) => (
              <Col key={product.title} xs={12} sm={6} lg={5} xl={4}>
                <Card className="product-card h-100">
                  <div className="product-image-wrap">
                    <Card.Img variant="top" src={product.imageUrl} alt={product.title} />
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{product.title}</Card.Title>
                    <div className="product-footer mt-auto">
                      <span className="price">${product.price}</span>
                      <Button variant="info" className="text-white fw-semibold">
                        Add to Cart
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </main>

      <footer className="store-footer">
        <Container>
          <h2>The Generics</h2>
        </Container>
      </footer>
    </div>
  )
}

export default App
