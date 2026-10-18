import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import "../styles/cart.css";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/restaurants" className="continue-shopping">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div className="cart-item" key={item._id}>
            <img
              src={item.imageUrl}
              alt={item.title}
              className="cart-item-image"
            />

            <div className="cart-item-details">
              <h3>{item.title}</h3>
              <p>₹{Number(item.price).toFixed(2)} each</p>

              <div className="quantity-controls">
                <button
                  type="button"
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  type="button"
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <p>
                Item total: ₹{(Number(item.price) * item.quantity).toFixed(2)}
              </p>

              <button
                type="button"
                className="remove-item"
                onClick={() => removeFromCart(item._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Subtotal: ₹{totalPrice.toFixed(2)}</h2>
        <p>Delivery charges and taxes, if applicable, are not included.</p>

        <button type="button" onClick={clearCart}>
          Clear Cart
        </button>

        <Link to="/checkout" className="checkout-button">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

export default Cart;
