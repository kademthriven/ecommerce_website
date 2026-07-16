import { Card, Container } from 'react-bootstrap'

function ProfilePage() {
  return (
    <main className="profile-section">
      <Container>
        <Card className="profile-card">
          <Card.Body>
            <p className="profile-eyebrow text-uppercase">My account</p>
            <h2>Profile</h2>
            <p className="mb-0">
              You are logged in and can now access the store.
            </p>
          </Card.Body>
        </Card>
      </Container>
    </main>
  )
}

export default ProfilePage
