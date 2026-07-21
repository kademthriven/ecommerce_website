import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import AppWithCart from './components/AppWithCart.jsx'
import AuthProvider from './context/AuthProvider.jsx'
import store from './store/index.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <AppWithCart />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
