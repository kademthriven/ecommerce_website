import { useCallback, useState } from 'react'
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { products } from '../data/products'
import useCart from '../hooks/useCart'
import useAuth from '../hooks/useAuth'
import { ShoppingBag } from 'lucide-react'
import { useHistory } from 'react-router-dom'

function StorePage() {
  const { addItemToCart } = useCart()
  const { isLoggedIn } = useAuth()
  const history = useHistory()
  const [addingProductId, setAddingProductId] = useState('')
  const [feedback, setFeedback] = useState('')

  const handleAddToCart = useCallback(
    async (product) => {
      if (!isLoggedIn) {
        history.push('/login', { from: '/store' })
        return
      }
      setAddingProductId(product.id)
      setFeedback('')

      try {
        await addItemToCart(product)
      } catch (error) {
        setFeedback(error.message)
      } finally {
        setAddingProductId('')
      }
    },
    [addItemToCart, history, isLoggedIn],
  )

  return (
    <main className="products-section">
      <Container>
        <div className="section-heading">
          <p>THE COLLECTION</p>
          <h1>Made for everyday life</h1>
          <span className="section-intro">Fewer, better products selected for quality, usefulness, and timeless design.</span>
        </div>

        {feedback && <Alert variant="danger">{feedback}</Alert>}

        <Row className="g-4 justify-content-center">
          {products.map((product) => (
            <Col key={product.id} xs={12} sm={6} lg={3}>
              <Card className="product-card h-100">
                <Link className="product-details-link" to={`/products/${product.id}`}>
                  <div className="product-image-wrap">
                    <Card.Img variant="top" src={product.imageUrl} alt={product.title} loading="lazy" />
                    {product.badge && <span className="product-badge">{product.badge}</span>}
                  </div>
                  <small>{product.category}</small>
                  <Card.Title>{product.title}</Card.Title>
                </Link>
                <Card.Body className="d-flex flex-column pt-0">
                  <div className="product-footer mt-auto">
                    <span className="price">${product.price}</span>
                    <Button
                      variant="info"
                      className="text-white fw-semibold"
                      disabled={addingProductId === product.id}
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingBag size={17} /> {addingProductId === product.id ? 'Adding...' : isLoggedIn ? 'Add to cart' : 'Sign in to buy'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </main>
  )
}

export default StorePage
