import { useCallback, useState } from 'react'
import { Alert, Button, Image, Offcanvas, Spinner, Table } from 'react-bootstrap'
import { Trash2 } from 'lucide-react'
import useCart from '../hooks/useCart'

function Cart({ onClose, show }) {
  const {
    cartError,
    cartItems,
    cartTotal,
    isCartLoading,
    removeItemFromCart,
  } = useCart()
  const [removingItem, setRemovingItem] = useState('')
  const [checkoutNotice, setCheckoutNotice] = useState('')

  const handleRemoveItem = useCallback(
    async (itemKey) => {
      setRemovingItem(itemKey)

      try {
        await removeItemFromCart(itemKey)
      } catch {
        // Cart displays the request error in the panel.
      } finally {
        setRemovingItem('')
      }
    },
    [removeItemFromCart],
  )

  return (
    <Offcanvas id="shopping-cart" show={show} onHide={onClose} placement="end" className="cart-panel">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Your cart</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        {cartError && <Alert variant="danger">{cartError}</Alert>}
        {checkoutNotice && <Alert variant="success">{checkoutNotice}</Alert>}

        {isCartLoading && cartItems.length === 0 ? (
          <div className="d-flex justify-content-center py-5" role="status">
            <Spinner animation="border" aria-hidden="true" />
            <span className="visually-hidden">Loading cart...</span>
          </div>
        ) : cartItems.length > 0 ? (
          <Table responsive borderless className="cart-table align-middle">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>
                  <span className="visually-hidden">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => {
                const itemKey = item.productId || item.title

                return (
                <tr key={itemKey}>
                  <td>
                    <div className="cart-item">
                      <Image src={item.imageUrl} alt={item.title} rounded />
                      <span>{item.title}</span>
                    </div>
                  </td>
                  <td>${item.price}</td>
                  <td>
                    <span className="quantity-pill">{item.quantity}</span>
                  </td>
                  <td className="text-end">
                    <Button
                      aria-label={`Remove ${item.title}`}
                      variant="danger"
                      size="sm"
                      className="remove-btn"
                      disabled={isCartLoading || removingItem === itemKey}
                      onClick={() => handleRemoveItem(itemKey)}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      Remove
                    </Button>
                  </td>
                </tr>
                )
              })}
            </tbody>
          </Table>
        ) : (
          <p className="empty-cart-message">Your cart is empty.</p>
        )}

        <div className="cart-total">
          <span>Total</span>
          <strong>${cartTotal}</strong>
        </div>

        <Button disabled={cartItems.length === 0} className="purchase-btn" onClick={() => setCheckoutNotice('Your cart is ready. Connect a payment provider to accept live payments.')}>
          Proceed to checkout
        </Button>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default Cart
