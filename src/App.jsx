import { Redirect, Route, Switch } from 'react-router-dom'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import MoviesPage from './pages/MoviesPage'
import ProductDetailPage from './pages/ProductDetailPage'
import StorePage from './pages/StorePage'
import './App.css'

function App() {
  return (
    <Layout>
      <Switch>
        <Route path={['/', '/index.html']} exact component={HomePage} />
        <Route path="/store" exact component={StorePage} />
        <Route path={['/about', '/about.html']} exact component={AboutPage} />
        <Route path="/contact-us" exact component={ContactPage} />
        <Route path="/movies" exact component={MoviesPage} />
        <Route path="/products/:productId" exact component={ProductDetailPage} />
        <Redirect to="/" />
      </Switch>
    </Layout>
  )
}

export default App
