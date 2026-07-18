import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { createFirebaseAccount } from '../api/auth'
import useAuth from '../hooks/useAuth'

function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const requestControllerRef = useRef(null)
  const history = useHistory()
  const { login } = useAuth()

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const displayName = formData.get('name').trim()
    const email = formData.get('email').trim()
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      setFeedback({ type: 'danger', message: 'Passwords do not match.' })
      return
    }
    const controller = new AbortController()

    requestControllerRef.current?.abort()
    requestControllerRef.current = controller
    setFeedback({ type: '', message: '' })
    setIsLoading(true)

    try {
      const responseData = await createFirebaseAccount(
        email,
        password,
        displayName,
        controller.signal,
      )
      login(responseData.idToken, responseData.email)
      history.replace('/store')
    } catch (error) {
      if (error.name !== 'AbortError') {
        const message = error.message === 'EMAIL_EXISTS'
          ? 'An account already exists for this email. Try logging in instead.'
          : error.message.replaceAll('_', ' ')
        setFeedback({ type: 'danger', message })
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
        <section className="auth-card" aria-labelledby="signup-title">
          <div className="section-heading auth-heading">
            <p>JOIN NORTHSTAR</p>
            <h1 id="signup-title">Create your account</h1>
            <span>Save your cart and enjoy a faster checkout.</span>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="signup-name">
              <Form.Label>Full name</Form.Label>
              <Form.Control name="name" type="text" autoComplete="name" placeholder="Your name" disabled={isLoading} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="signup-email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                disabled={isLoading}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="signup-password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                minLength={6}
                disabled={isLoading}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="signup-confirm-password">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control name="confirmPassword" type="password" autoComplete="new-password" placeholder="Repeat your password" minLength={6} disabled={isLoading} required />
            </Form.Group>

            <Button className="auth-submit-button" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" aria-hidden="true" />
                  <span>Creating account...</span>
                </>
              ) : (
                'Create account'
              )}
            </Button>

            {feedback.message && (
              <Alert className="auth-feedback" variant={feedback.type} aria-live="assertive">
                {feedback.message}
              </Alert>
            )}

            <p className="auth-switch-copy">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </Form>
        </section>
      </Container>
    </main>
  )
}

export default SignUpPage
