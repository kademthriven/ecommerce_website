import { useCallback, useState } from 'react'
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { products } from '../data/products'
import useCart from '../hooks/useCart'

function StorePage() {
  const { addItemToCart } = useCart()
  const [addingProductId, setAddingProductId] = useState('')
  const [feedback, setFeedback] = useState('')

  const handleAddToCart = useCallback(
    async (product) => {
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
    [addItemToCart],
  )

  return (
    <main className="products-section">
      <Container>
        <div className="section-heading">
          <p className="text-uppercase fw-semibold">Music</p>
          <h2>Featured Albums</h2>
        </div>

        {feedback && <Alert variant="danger">{feedback}</Alert>}

        <Row className="g-4 justify-content-center">
          {products.map((product) => (
            <Col key={product.id} xs={12} sm={6} lg={5} xl={4}>
              <Card className="product-card h-100">
                <Link className="product-details-link" to={`/products/${product.id}`}>
                  <div className="product-image-wrap">
                    <Card.Img variant="top" src={product.imageUrl} alt={product.title} />
                  </div>
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
                      {addingProductId === product.id ? 'Adding...' : 'Add to Cart'}
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
