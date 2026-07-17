import App from '../App'
import useAuth from '../hooks/useAuth'
import CartProvider from '../context/CartProvider'

function AppWithCart() {
  const { userEmail } = useAuth()

  return (
    <CartProvider key={userEmail || 'anonymous'}>
      <App />
    </CartProvider>
  )
}

export default AppWithCart
