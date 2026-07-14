import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import useCart from '../hooks/useCart'

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

function StorePage() {
  const { addItemToCart } = useCart()

  return (
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
                    <Button
                      variant="info"
                      className="text-white fw-semibold"
                      onClick={() => addItemToCart(product)}
                    >
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
  )
}

export default StorePage
