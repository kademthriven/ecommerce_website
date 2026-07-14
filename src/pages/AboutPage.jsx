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
            src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80"
            alt="Band performing on stage"
            roundedCircle
            className="about-image"
          />
          <div className="about-copy">
            <p>
              The Generics is a music store built for fans who love collecting
              bold, colorful albums. Browse the featured collection, add albums
              to your cart, and keep track of every item while you shop.
            </p>
            <p>
              This About page is rendered through React Router, so clicking the
              About navigation link changes the URL without refreshing the app.
              The route can also be opened directly and shared as a normal page.
            </p>
          </div>
        </div>
      </Container>
    </main>
  )
}

export default AboutPage
