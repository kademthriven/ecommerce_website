import { lazy, Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import useAuth from './hooks/useAuth'
import './App.css'

const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SignUpPage = lazy(() => import('./pages/SignUpPage'))
const StorePage = lazy(() => import('./pages/StorePage'))

function PageLoadingFallback() {
  return (
    <main className="route-loading" role="status" aria-live="polite">
      <span className="route-loading-spinner" aria-hidden="true" />
      <span>Loading page...</span>
    </main>
  )
}

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
      <Suspense fallback={<PageLoadingFallback />}>
        <Switch>
          {!isLoggedIn && <Route path="/login" exact component={LoginPage} />}
          {!isLoggedIn && <Route path="/signup" exact component={SignUpPage} />}

          <Route path={['/', '/index.html']} exact component={HomePage} />
          <Route path={['/about', '/about.html']} exact component={AboutPage} />
          <Route path="/contact-us" exact component={ContactPage} />
          <Route path="/store" exact component={StorePage} />
          <Route path="/products/:productId" exact component={ProductDetailPage} />
          {isLoggedIn && <Route path="/profile" exact component={ProfilePage} />}
          {isLoggedIn && <Redirect from={['/login', '/signup']} to="/store" />}

          <Redirect to="/" />
        </Switch>
      </Suspense>
    </Layout>
  )
}

export default App
