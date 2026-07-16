import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap'

const filmsUrl = 'https://swapi.info/api/films'
const retryErrorMessage = 'Something went wrong ....Retrying'

const MovieCard = memo(function MovieCard({ film }) {
  return (
    <Col md={6} xl={4}>
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
  )
})

function MoviesPage() {
  const [films, setFilms] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const abortControllerRef = useRef(null)
  const retryTimeoutRef = useRef(null)
  const shouldRetryRef = useRef(false)

  const cancelRetry = useCallback(() => {
    shouldRetryRef.current = false
    clearTimeout(retryTimeoutRef.current)
    abortControllerRef.current?.abort()
    setIsLoading(false)
    setError('')
  }, [])

  const fetchFilmsWithRetry = useCallback(async function fetchWithRetry() {
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch(filmsUrl, {
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(retryErrorMessage)
      }

      const data = await response.json()
      setFilms(data)
      setError('')
      setIsLoading(false)
      shouldRetryRef.current = false
    } catch (fetchError) {
      if (!shouldRetryRef.current || fetchError.name === 'AbortError') {
        return
      }

      setError(retryErrorMessage)
      setFilms([])
      retryTimeoutRef.current = setTimeout(fetchWithRetry, 5000)
    }
  }, [])

  const fetchFilms = useCallback(() => {
    clearTimeout(retryTimeoutRef.current)
    shouldRetryRef.current = true
    setIsLoading(true)
    setError('')
    void fetchFilmsWithRetry()
  }, [fetchFilmsWithRetry])

  const orderedFilms = useMemo(
    () => [...films].sort((firstFilm, secondFilm) => firstFilm.episode_id - secondFilm.episode_id),
    [films],
  )

  useEffect(() => {
    fetchFilms()

    return () => {
      shouldRetryRef.current = false
      clearTimeout(retryTimeoutRef.current)
      abortControllerRef.current?.abort()
    }
  }, [fetchFilms])

  return (
    <main className="movies-section">
      <Container>
        <div className="section-heading">
          <p className="text-uppercase fw-semibold">Fetch API</p>
          <h2>Star Wars Films</h2>
        </div>

        <div className="fetch-actions">
          <Button
            variant="info"
            className="text-white fw-semibold"
            disabled={isLoading}
            onClick={fetchFilms}
          >
            {isLoading ? 'Fetching...' : films.length > 0 ? 'Refresh Movies' : 'Fetch Movies'}
          </Button>
        </div>

        {isLoading && (
          <div className="loading-state">
            <Spinner animation="border" variant="info" />
            <span>Loading films...</span>
          </div>
        )}

        {error && (
          <Alert
            variant="danger"
            className="retry-alert"
          >
            <span>{error}</span>
            <Button variant="outline-danger" size="sm" onClick={cancelRetry}>
              Cancel
            </Button>
          </Alert>
        )}

        {!isLoading && !error && orderedFilms.length > 0 && (
          <Row className="g-4">
            {orderedFilms.map((film) => (
              <MovieCard key={film.url} film={film} />
            ))}
          </Row>
        )}
      </Container>
    </main>
  )
}

export default MoviesPage
