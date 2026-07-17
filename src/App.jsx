import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MoviesPage from './pages/MoviesPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProfilePage from './pages/ProfilePage'
import StorePage from './pages/StorePage'
import useAuth from './hooks/useAuth'
import './App.css'

function App() {
  const { authNotice, isAuthLoading, isLoggedIn } = useAuth()
  const location = useLocation()

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

  if (authNotice && location.pathname !== '/login') {
    return <Redirect to="/login" />
  }

  return (
    <Layout>
      <Switch>
        {!isLoggedIn && <Route path="/login" exact component={LoginPage} />}

        <Route path={['/', '/index.html']} exact component={HomePage} />
        <Route path="/store" exact component={StorePage} />
        <Route path={['/about', '/about.html']} exact component={AboutPage} />
        <Route path="/contact-us" exact component={ContactPage} />
        <Route path="/movies" exact component={MoviesPage} />
        <Route path="/products/:productId" exact component={ProductDetailPage} />
        {isLoggedIn && <Route path="/profile" exact component={ProfilePage} />}

        <Redirect to="/" />
      </Switch>
    </Layout>
  )
}

export default App
