import { Button, Image, Offcanvas, Table } from 'react-bootstrap'
import { Trash2 } from 'lucide-react'

function Cart({ cartItems, onClose, onRemove, show }) {
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  return (
    <Offcanvas show={show} onHide={onClose} placement="end" className="cart-panel">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Cart</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
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
                    onClick={() => onRemove(item.title)}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="cart-total">
          <span>Total</span>
          <strong>${totalAmount}</strong>
        </div>

        <Button variant="info" className="purchase-btn text-white fw-bold">
          Purchase
        </Button>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default Cart
