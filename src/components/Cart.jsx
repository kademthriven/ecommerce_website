import { Button, Image, Offcanvas, Table } from 'react-bootstrap'
import { Trash2 } from 'lucide-react'
import useCart from '../hooks/useCart'

function Cart({ onClose, show }) {
  const { cartItems, cartTotal, removeItemFromCart } = useCart()

  return (
    <Offcanvas show={show} onHide={onClose} placement="end" className="cart-panel">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Cart</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        {cartItems.length > 0 ? (
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
              {cartItems.map((item) => (
                <tr key={item.title}>
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
                      onClick={() => removeItemFromCart(item.title)}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="empty-cart-message">Your cart is empty.</p>
        )}

        <div className="cart-total">
          <span>Total</span>
          <strong>${cartTotal}</strong>
        </div>

        <Button variant="info" className="purchase-btn text-white fw-bold">
          Purchase
        </Button>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default Cart
