import { Redirect, Route, Switch } from 'react-router-dom'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MoviesPage from './pages/MoviesPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProfilePage from './pages/ProfilePage'
import SignUpPage from './pages/SignUpPage'
import StorePage from './pages/StorePage'
import useAuth from './hooks/useAuth'
import './App.css'

function App() {
  const { isAuthLoading, isLoggedIn } = useAuth()

  if (isAuthLoading) {
    return (
      <main
        className="d-flex min-vh-100 align-items-center justify-content-center"
        role="status"
      >
        Checking session...
      </main>
    )
  }

  return (
    <Layout>
      <Switch>
        {!isLoggedIn && <Route path="/login" exact component={LoginPage} />}
        {!isLoggedIn && <Route path="/signup" exact component={SignUpPage} />}

        {isLoggedIn && (
          <Route path={['/', '/index.html']} exact component={HomePage} />
        )}
        {isLoggedIn && <Route path="/store" exact component={StorePage} />}
        {isLoggedIn && (
          <Route path={['/about', '/about.html']} exact component={AboutPage} />
        )}
        {isLoggedIn && <Route path="/contact-us" exact component={ContactPage} />}
        {isLoggedIn && <Route path="/movies" exact component={MoviesPage} />}
        {isLoggedIn && (
          <Route path="/products/:productId" exact component={ProductDetailPage} />
        )}
        {isLoggedIn && <Route path="/profile" exact component={ProfilePage} />}

        <Redirect to={isLoggedIn ? '/' : '/login'} />
      </Switch>
    </Layout>
  )
}

export default App
