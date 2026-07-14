import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap'

const filmsUrl = 'https://swapi.info/api/films'

function MoviesPage() {
  const [films, setFilms] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchFilms() {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(filmsUrl)

        if (!response.ok) {
          throw new Error('Could not fetch films')
        }

        const data = await response.json()
        setFilms(data)
      } catch (fetchError) {
        setError(fetchError.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFilms()
  }, [])

  return (
    <main className="movies-section">
      <Container>
        <div className="section-heading">
          <p className="text-uppercase fw-semibold">Fetch API</p>
          <h2>Star Wars Films</h2>
        </div>

        {isLoading && (
          <div className="loading-state">
            <Spinner animation="border" variant="info" />
            <span>Loading films...</span>
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!isLoading && !error && (
          <Row className="g-4">
            {films.map((film) => (
              <Col key={film.url} md={6} xl={4}>
                <Card className="movie-card h-100">
                  <Card.Body>
                    <Card.Subtitle className="mb-2 text-info fw-bold">
                      Episode {film.episode_id}
                    </Card.Subtitle>
                    <Card.Title>{film.title}</Card.Title>
                    <Card.Text>
                      Directed by {film.director}. Released on {film.release_date}.
                    </Card.Text>
                    <Button
                      as="a"
                      href={film.url}
                      target="_blank"
                      rel="noreferrer"
                      variant="outline-info"
                    >
                      View API
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </main>
  )
}

export default MoviesPage
