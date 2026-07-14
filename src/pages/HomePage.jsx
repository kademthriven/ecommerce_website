import { Button, Container } from 'react-bootstrap'

const tours = [
  {
    date: 'JUL 16',
    city: 'Detroit, MI',
    venue: 'DTE Energy Music Theatre',
  },
  {
    date: 'JUL 19',
    city: 'Toronto, ON',
    venue: 'Budweiser Stage',
  },
  {
    date: 'JUL 22',
    city: 'Bristow, VA',
    venue: 'Jiffy Lube Live',
  },
  {
    date: 'JUL 29',
    city: 'Phoenix, AZ',
    venue: 'AK-Chin Pavilion',
  },
  {
    date: 'AUG 2',
    city: 'Las Vegas, NV',
    venue: 'T-Mobile Arena',
  },
  {
    date: 'AUG 7',
    city: 'Concord, CA',
    venue: 'Concord Pavilion',
  },
]

function HomePage() {
  return (
    <main className="home-section">
      <Container>
        <div className="section-heading">
          <p className="text-uppercase fw-semibold">Live</p>
          <h2>Tours</h2>
        </div>

        <div className="tour-list">
          {tours.map((tour) => (
            <div className="tour-row" key={`${tour.date}-${tour.city}`}>
              <span className="tour-date">{tour.date}</span>
              <span className="tour-city">{tour.city}</span>
              <span className="tour-venue">{tour.venue}</span>
              <Button variant="info" className="tour-button text-white fw-semibold">
                Buy Tickets
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </main>
  )
}

export default HomePage
