import { ArrowRight, PackageCheck, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { products } from '../data/products'

function HomePage() {
  return (
    <main>
      <section className="commerce-hero">
        <Container className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={15} /> New season, better essentials</span>
            <h1>Good design for your everyday.</h1>
            <p>Curated pieces that look better, last longer, and make the daily routine feel a little more considered.</p>
            <div className="hero-actions">
              <Link className="primary-cta" to="/store">Shop the collection <ArrowRight size={18} /></Link>
              <Link className="secondary-cta" to="/about">Our approach</Link>
            </div>
            <div className="hero-proof"><span><strong>4.8/5</strong> customer rating</span><span><strong>12k+</strong> happy customers</span></div>
          </div>
          <div className="hero-visual">
            <img src="https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1100&q=85" alt="Thoughtfully designed chair in a bright modern interior" />
            <div className="hero-float-card"><span>Curated weekly</span><strong>Fresh finds, fewer choices.</strong></div>
          </div>
        </Container>
      </section>

      <section className="benefit-strip">
        <Container className="benefit-grid">
          <div><PackageCheck /><span><strong>Free shipping</strong> on orders over $75</span></div>
          <div><RefreshCw /><span><strong>Easy returns</strong> within 30 days</span></div>
          <div><ShieldCheck /><span><strong>Secure checkout</strong> and protected data</span></div>
        </Container>
      </section>

      <section className="featured-section">
        <Container>
          <div className="section-heading section-heading-row">
            <div><p>CURATED FOR YOU</p><h2>Current favorites</h2></div>
            <Link to="/store">View all products <ArrowRight size={17} /></Link>
          </div>
          <div className="featured-grid">
            {products.map((product) => (
              <Link className="featured-product" to={`/products/${product.id}`} key={product.id}>
                <div className="featured-image"><img src={product.imageUrl} alt={product.title} loading="lazy" />{product.badge && <span>{product.badge}</span>}</div>
                <div className="featured-meta"><div><small>{product.category}</small><h3>{product.title}</h3></div><strong>${product.price}</strong></div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="newsletter-section">
        <Container className="newsletter-card"><div><p>THE NORTHSTAR EDIT</p><h2>Useful things, occasionally.</h2><span>Product stories, care tips, and first access to new drops.</span></div><Link to="/signup">Create an account <ArrowRight size={18} /></Link></Container>
      </section>
    </main>
  )
}

export default HomePage
