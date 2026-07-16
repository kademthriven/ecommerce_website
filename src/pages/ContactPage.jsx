import { useCallback, useState } from 'react'
import { Alert, Button, Container, Form } from 'react-bootstrap'
import { getFirebaseRequestError, getFirebaseUrl } from '../api/firebase'

function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const contactDetails = {
      name: formData.get('name').trim(),
      email: formData.get('email').trim(),
      phone: formData.get('phone').trim(),
    }

    setIsSubmitting(true)
    setFeedback({ type: '', message: '' })

    try {
      const response = await fetch(getFirebaseUrl('contacts'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactDetails),
      })

      if (!response.ok) {
        throw new Error(getFirebaseRequestError('send your message', response))
      }

      await response.json()
      form.reset()
      setFeedback({
        type: 'success',
        message: 'Thank you. Your contact details were submitted successfully.',
      })
    } catch (error) {
      setFeedback({ type: 'danger', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return (
    <main className="contact-section">
      <Container>
        <div className="section-heading">
          <p className="text-uppercase fw-semibold">Get in touch</p>
          <h2>Contact Us</h2>
        </div>

        <Form className="contact-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="contact-name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              type="text"
              autoComplete="name"
              maxLength={100}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="contact-email">
            <Form.Label>Email ID</Form.Label>
            <Form.Control
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="contact-phone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              maxLength={30}
              required
            />
          </Form.Group>

          <Button className="contact-submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>

          {feedback.message && (
            <Alert className="contact-feedback" variant={feedback.type} aria-live="polite">
              {feedback.message}
            </Alert>
          )}
        </Form>
      </Container>
    </main>
  )
}

export default ContactPage
