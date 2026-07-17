import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap'
import { changeFirebasePassword } from '../api/auth'
import useAuth from '../hooks/useAuth'

function ProfilePage() {
  const { login, token } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const requestControllerRef = useRef(null)

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault()

      const form = event.currentTarget
      const formData = new FormData(form)
      const newPassword = formData.get('newPassword')
      const controller = new AbortController()

      requestControllerRef.current?.abort()
      requestControllerRef.current = controller
      setFeedback({ type: '', message: '' })
      setIsLoading(true)

      try {
        const responseData = await changeFirebasePassword(
          token,
          newPassword,
          controller.signal,
        )

        login(responseData.idToken, responseData.email)
        form.reset()
        setFeedback({
          type: 'success',
          message: 'Your password was changed successfully.',
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          setFeedback({
            type: 'danger',
            message:
              error.name === 'FirebaseAuthError'
                ? error.message.replaceAll('_', ' ')
                : error.message,
          })
        }
      } finally {
        if (requestControllerRef.current === controller) {
          requestControllerRef.current = null
          setIsLoading(false)
        }
      }
    },
    [login, token],
  )

  useEffect(() => () => requestControllerRef.current?.abort(), [])

  return (
    <main className="profile-section">
      <Container>
        <section className="profile-card" aria-labelledby="profile-title">
          <div className="section-heading profile-heading">
            <p className="text-uppercase fw-semibold">Account settings</p>
            <h2 id="profile-title">Your User Profile</h2>
          </div>

          <Form className="change-password-form" onSubmit={handleSubmit}>
            <Form.Group controlId="new-password">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                name="newPassword"
                type="password"
                autoComplete="new-password"
                minLength={6}
                disabled={isLoading}
                required
              />
              <Form.Text>Password must contain at least 6 characters.</Form.Text>
            </Form.Group>

            <Button
              className="change-password-button"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" aria-hidden="true" />
                  <span>Changing password...</span>
                </>
              ) : (
                'Change Password'
              )}
            </Button>

            {feedback.message && (
              <Alert
                className="profile-feedback"
                variant={feedback.type}
                aria-live="assertive"
              >
                {feedback.message}
              </Alert>
            )}
          </Form>
        </section>
      </Container>
    </main>
  )
}

export default ProfilePage
