import { memo, useCallback, useRef, useState } from 'react'
import { Button, Card, Container } from 'react-bootstrap'
import { ArrowLeft, ShoppingCart, ZoomIn } from 'lucide-react'
import { Link, Redirect, useParams } from 'react-router-dom'
import { findProductById } from '../data/products'
import useCart from '../hooks/useCart'

const StarRating = memo(function StarRating({ rating }) {
  return (
    <span className="star-rating" aria-label={`${rating} out of 5 stars`}>
      <span aria-hidden="true">{'★'.repeat(Math.round(rating))}</span>
      <strong>{rating}</strong>
    </span>
  )
})

const ProductGallery = memo(function ProductGallery({ images, title }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const mainImageRef = useRef(null)
  const selectedImage = images[selectedIndex]

  const handlePointerMove = useCallback((event) => {
    if (event.pointerType === 'touch') {
      return
    }

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100
    mainImageRef.current.style.transformOrigin = `${x}% ${y}%`
  }, [])

  const resetZoomOrigin = useCallback(() => {
    mainImageRef.current.style.transformOrigin = selectedImage.position
  }, [selectedImage.position])

  return (
    <div className="product-gallery">
      <div className="product-main-image" onPointerMove={handlePointerMove} onPointerLeave={resetZoomOrigin}>
        <img
          ref={mainImageRef}
          src={selectedImage.src}
          alt={`${title} — ${selectedImage.label}`}
          style={{
            '--image-scale': selectedImage.scale,
            '--zoom-scale': selectedImage.scale * 1.65,
            transformOrigin: selectedImage.position,
          }}
        />
        <span className="zoom-hint">
          <ZoomIn size={17} aria-hidden="true" /> Hover to zoom
        </span>
      </div>

      <div className="product-thumbnails" aria-label="Choose a product view">
        {images.map((image, index) => (
          <button
            key={image.label}
            type="button"
            className={index === selectedIndex ? 'product-thumbnail active' : 'product-thumbnail'}
            aria-label={image.label}
            aria-pressed={index === selectedIndex}
            onClick={() => setSelectedIndex(index)}
          >
            <img
              src={image.src}
              alt=""
              style={{ transform: `scale(${image.scale})`, transformOrigin: image.position }}
            />
          </button>
        ))}
      </div>
    </div>
  )
})

function ProductDetailPage() {
  const { productId } = useParams()
  const product = findProductById(productId)
  const { addItemToCart } = useCart()

  if (!product) {
    return <Redirect to="/store" />
  }

  return (
    <main className="product-detail-section">
      <Container>
        <Link className="back-to-store" to="/store">
          <ArrowLeft size={18} aria-hidden="true" /> Back to albums
        </Link>

        <div className="product-detail-layout">
          <ProductGallery images={product.images} title={product.title} />

          <section className="product-summary" aria-labelledby="product-title">
            <p className="product-eyebrow">Limited album edition</p>
            <h2 id="product-title">{product.title}</h2>
            <StarRating rating={product.rating} />
            <p className="product-detail-price">${product.price}</p>
            <p className="product-description">{product.description}</p>
            <Button className="product-add-button" onClick={() => addItemToCart(product)}>
              <ShoppingCart size={19} aria-hidden="true" /> Add to Cart
            </Button>
          </section>
        </div>

        <section className="product-reviews" aria-labelledby="reviews-title">
          <div className="reviews-heading">
            <div>
              <p className="product-eyebrow">Verified listeners</p>
              <h3 id="reviews-title">Customer Reviews</h3>
            </div>
            <StarRating rating={product.rating} />
          </div>

          <div className="reviews-grid">
            {product.reviews.map((review) => (
              <Card className="review-card" key={review.id}>
                <Card.Body>
                  <StarRating rating={review.rating} />
                  <Card.Title>{review.title}</Card.Title>
                  <Card.Text>{review.comment}</Card.Text>
                  <footer>
                    <strong>{review.author}</strong>
                    <span>{review.date}</span>
                  </footer>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>
      </Container>
    </main>
  )
}

export default ProductDetailPage
