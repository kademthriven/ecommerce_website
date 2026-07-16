import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap'
import { createFirebaseAccount } from '../api/auth'

function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const requestControllerRef = useRef(null)

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const email = formData.get('email').trim()
    const password = formData.get('password')
    const controller = new AbortController()

    requestControllerRef.current?.abort()
    requestControllerRef.current = controller
    setFeedback({ type: '', message: '' })
    setIsLoading(true)

    try {
      await createFirebaseAccount(email, password, controller.signal)
      form.reset()
      setFeedback({
        type: 'success',
        message: 'Your account was created successfully.',
      })
    } catch (error) {
      if (error.name !== 'AbortError') {
        setFeedback({ type: 'danger', message: error.message })
      }
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => () => requestControllerRef.current?.abort(), [])

  return (
    <main className="signup-section">
      <Container>
        <section className="signup-card" aria-labelledby="signup-title">
          <div className="section-heading signup-heading">
            <p className="text-uppercase fw-semibold">Join The Generics</p>
            <h2 id="signup-title">Sign Up</h2>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="signup-email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                autoComplete="email"
                disabled={isLoading}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="signup-password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                autoComplete="new-password"
                disabled={isLoading}
                required
              />
            </Form.Group>

            <Button className="signup-submit-button" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" aria-hidden="true" />
                  <span>Sending request...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </Button>

            {feedback.message && (
              <Alert className="signup-feedback" variant={feedback.type} aria-live="assertive">
                {feedback.message}
              </Alert>
            )}
          </Form>
        </section>
      </Container>
    </main>
  )
}

export default SignUpPage
