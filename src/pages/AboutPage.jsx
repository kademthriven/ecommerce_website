import { Container, Image } from 'react-bootstrap'

function AboutPage() {
  return (
    <main className="about-section">
      <Container>
        <div className="section-heading">
          <p className="text-uppercase fw-semibold">About</p>
          <h2>About Us</h2>
        </div>

        <div className="about-content">
          <Image
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=85"
            alt="Northstar team working together in a bright studio"
            loading="lazy"
            className="about-image"
          />
          <div className="about-copy">
            <p>
              Northstar began with a simple idea: everyday products should be useful,
              well made, and beautiful enough to keep. We search for thoughtful designs
              that earn their place in your routine.
            </p>
            <p>
              We keep the collection intentionally small so choosing feels easy. Every
              piece is selected for lasting materials, honest value, and a clean point
              of view that will still feel good next season.
            </p>
          </div>
        </div>
      </Container>
    </main>
  )
}

export default AboutPage
