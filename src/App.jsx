import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import MoviesPage from './pages/MoviesPage'
import StorePage from './pages/StorePage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="index.html" element={<HomePage />} />
        <Route path="store" element={<StorePage />} />
        <Route path="about.html" element={<AboutPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="movies" element={<MoviesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
