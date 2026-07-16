import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import {
  databaseUrl,
  firebaseConfigurationError,
  getFirebaseRequestError,
  getFirebaseUrl,
} from '../api/firebase'

const moviesUrl = databaseUrl ? getFirebaseUrl('movies') : ''

const AddMovieForm = memo(function AddMovieForm({ onAddMovie }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault()

      const form = event.currentTarget
      const formData = new FormData(form)
      const NewMovieObj = {
        title: formData.get('title').trim(),
        openingText: formData.get('openingText').trim(),
        releaseDate: formData.get('releaseDate'),
      }

      console.log(NewMovieObj)
      setIsSubmitting(true)

      try {
        await onAddMovie(NewMovieObj)
        form.reset()
      } catch {
        // The page displays the request error while preserving the entered values.
      } finally {
        setIsSubmitting(false)
      }
    },
    [onAddMovie],
  )

  return (
    <Form className="add-movie-form" onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="movie-title">
        <Form.Label>Title</Form.Label>
        <Form.Control name="title" type="text" required />
      </Form.Group>

      <Form.Group className="mb-3" controlId="movie-opening-text">
        <Form.Label>Opening Text</Form.Label>
        <Form.Control name="openingText" as="textarea" rows={4} required />
      </Form.Group>

      <Form.Group className="mb-4" controlId="movie-release-date">
        <Form.Label>Release Date</Form.Label>
        <Form.Control name="releaseDate" type="date" required />
      </Form.Group>

      <Button className="add-movie-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Add Movie'}
      </Button>
    </Form>
  )
})

const MovieCard = memo(function MovieCard({ film, isDeleting, onDelete }) {
  const handleDelete = useCallback(() => onDelete(film.id), [film.id, onDelete])

  return (
    <Col md={6} xl={4}>
      <Card className="movie-card h-100">
        <Card.Body className="d-flex flex-column">
          <Card.Title>{film.title}</Card.Title>
          <Card.Text className="movie-opening-text">{film.openingText}</Card.Text>
          <Card.Text className="mt-auto mb-3">
            <strong>Released:</strong> {film.releaseDate}
          </Card.Text>
          <Button
            variant="outline-danger"
            className="delete-movie-button"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? 'Deleting...' : 'Delete Movie'}
          </Button>
        </Card.Body>
      </Card>
    </Col>
  )
})

function MoviesPage() {
  const [films, setFilms] = useState([])
  const [fetchError, setFetchError] = useState('')
  const [mutationError, setMutationError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [deletingMovieIds, setDeletingMovieIds] = useState(() => new Set())
  const abortControllerRef = useRef(null)

  const fetchFilms = useCallback(async () => {
    if (!moviesUrl) {
      setFetchError(firebaseConfigurationError)
      return
    }

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller
    setIsLoading(true)
    setFetchError('')

    try {
      const response = await fetch(moviesUrl, { signal: controller.signal })

      if (!response.ok) {
        throw new Error(getFirebaseRequestError('fetch movies', response))
      }

      const data = await response.json()
      const loadedFilms = Object.entries(data ?? {}).map(([id, film]) => ({
        id,
        title: film.title,
        openingText: film.openingText,
        releaseDate: film.releaseDate,
      }))

      setFilms(loadedFilms)
    } catch (error) {
      if (error.name !== 'AbortError') {
        setFetchError(error.message)
      }
    } finally {
      if (abortControllerRef.current === controller) {
        setIsLoading(false)
      }
    }
  }, [])

  const addMovie = useCallback(async (newMovie) => {
    setMutationError('')

    try {
      if (!moviesUrl) {
        throw new Error(firebaseConfigurationError)
      }

      const response = await fetch(moviesUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie),
      })

      if (!response.ok) {
        throw new Error(getFirebaseRequestError('save the movie', response))
      }

      const data = await response.json()

      if (!data.name) {
        throw new Error('The database did not return an ID for the new movie.')
      }

      setFilms((currentFilms) => [...currentFilms, { id: data.name, ...newMovie }])
    } catch (error) {
      setMutationError(error.message)
      throw error
    }
  }, [])

  const deleteMovie = useCallback(async (movieId) => {
    setMutationError('')
    setDeletingMovieIds((currentIds) => new Set(currentIds).add(movieId))

    try {
      if (!databaseUrl) {
        throw new Error(firebaseConfigurationError)
      }

      const response = await fetch(getFirebaseUrl(`movies/${encodeURIComponent(movieId)}`), {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(getFirebaseRequestError('delete the movie', response))
      }

      setFilms((currentFilms) => currentFilms.filter((film) => film.id !== movieId))
    } catch (error) {
      setMutationError(error.message)
    } finally {
      setDeletingMovieIds((currentIds) => {
        const nextIds = new Set(currentIds)
        nextIds.delete(movieId)
        return nextIds
      })
    }
  }, [])

  const orderedFilms = useMemo(
    () =>
      [...films].sort(
        (firstFilm, secondFilm) =>
          firstFilm.releaseDate.localeCompare(secondFilm.releaseDate) ||
          firstFilm.title.localeCompare(secondFilm.title),
      ),
    [films],
  )

  useEffect(() => {
    const initialFetchTimeout = setTimeout(() => void fetchFilms(), 0)

    return () => {
      clearTimeout(initialFetchTimeout)
      abortControllerRef.current?.abort()
    }
  }, [fetchFilms])

  return (
    <main className="movies-section">
      <Container>
        <div className="section-heading">
          <p className="text-uppercase fw-semibold">Movie Database</p>
          <h2>Movies</h2>
        </div>

        <AddMovieForm onAddMovie={addMovie} />

        {mutationError && (
          <Alert variant="danger" className="movie-alert" dismissible onClose={() => setMutationError('')}>
            {mutationError}
          </Alert>
        )}

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
            <span>Loading movies...</span>
          </div>
        )}

        {fetchError && (
          <Alert variant="danger" className="movie-alert">
            <span>{fetchError}</span>
            <Button variant="outline-danger" size="sm" onClick={fetchFilms}>
              Retry
            </Button>
          </Alert>
        )}

        {!isLoading && !fetchError && orderedFilms.length === 0 && (
          <p className="empty-movies-message">No movies have been added yet.</p>
        )}

        {!isLoading && !fetchError && orderedFilms.length > 0 && (
          <Row className="g-4">
            {orderedFilms.map((film) => (
              <MovieCard
                key={film.id}
                film={film}
                isDeleting={deletingMovieIds.has(film.id)}
                onDelete={deleteMovie}
              />
            ))}
          </Row>
        )}
      </Container>
    </main>
  )
}

export default MoviesPage
