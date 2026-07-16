import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { signInFirebaseAccount } from '../api/auth'
import useAuth from '../hooks/useAuth'

function LoginPage() {
  const { login } = useAuth()
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const requestControllerRef = useRef(null)

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email').trim()
    const password = formData.get('password')
    const controller = new AbortController()

    requestControllerRef.current?.abort()
    requestControllerRef.current = controller
    setFeedback({ type: '', message: '' })
    setIsLoading(true)

    try {
      const responseData = await signInFirebaseAccount(email, password, controller.signal)

      console.log(responseData.idToken)
      login(responseData.idToken)
      history.replace('/profile')
    } catch (error) {
      if (error.name !== 'AbortError') {
        setFeedback({
          type: 'danger',
          message: error.name === 'FirebaseAuthError' ? 'Authentication failed.' : error.message,
        })
      }
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null
        setIsLoading(false)
      }
    }
  }, [history, login])

  useEffect(() => () => requestControllerRef.current?.abort(), [])

  return (
    <main className="auth-section">
      <Container>
        <section className="auth-card" aria-labelledby="login-title">
          <div className="section-heading auth-heading">
            <p className="text-uppercase fw-semibold">Welcome back</p>
            <h2 id="login-title">Login</h2>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="login-email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                autoComplete="email"
                disabled={isLoading}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="login-password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                autoComplete="current-password"
                disabled={isLoading}
                required
              />
            </Form.Group>

            <Button className="auth-submit-button" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" aria-hidden="true" />
                  <span>Sending request...</span>
                </>
              ) : (
                'Login'
              )}
            </Button>

            {feedback.message && (
              <Alert className="auth-feedback" variant={feedback.type} aria-live="assertive">
                {feedback.message}
              </Alert>
            )}

            <p className="auth-switch-copy">
              Need an account? <Link to="/signup">Sign up</Link>
            </p>
          </Form>
        </section>
      </Container>
    </main>
  )
}

export default LoginPage
