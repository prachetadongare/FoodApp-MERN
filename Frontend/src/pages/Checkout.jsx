import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import API from "../services/api";
import "../styles/checkout.css";

function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty. Add food before checkout.");
      return;
    }

    if (
      !address.fullName.trim() ||
      !address.street.trim() ||
      !address.city.trim()
    ) {
      setError("Please fill in all delivery details.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(address.phone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(address.pincode)) {
      setError("Enter a valid 6-digit PIN code.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in before placing your order.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await API.post(
        "/food/placeorder",
        {
          cart: cartItems.map((item) => ({
            _id: item._id,
            quantity: item.quantity,
          })),
          deliveryAddress: {
            fullName: address.fullName.trim(),
            phone: address.phone,
            street: address.street.trim(),
            city: address.city.trim(),
            pincode: address.pincode,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Unable to place your order.");
      }

      // Keep the order details before clearing the cart.
      setPlacedOrder(response.data.order);
      clearCart();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show confirmation before checking whether the cart is empty.
  if (placedOrder) {
    return (
      <main className="checkout-page">
        <h1>Order Placed Successfully!</h1>
        <p>Your order has been submitted.</p>

        {placedOrder._id && (
          <p>
            Order ID: <strong>{placedOrder._id}</strong>
          </p>
        )}

        <p>
          Order Total: ₹{Number(placedOrder.payment ?? totalPrice).toFixed(2)}
        </p>

        <p>Status: {placedOrder.status || "preparing"}</p>

        <Link to="/">Continue Shopping</Link>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
        <Link to="/restaurants">Browse Restaurants</Link>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <h1>Checkout</h1>
      <p>Enter your delivery details and review your order.</p>

      {error && (
        <p className="checkout-error" role="alert">
          {error}
        </p>
      )}

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Delivery Address</h2>

          <label>
            Full Name
            <input
              name="fullName"
              value={address.fullName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Mobile Number
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              value={address.phone}
              onChange={handleChange}
              maxLength={10}
              required
            />
          </label>

          <label>
            Street Address
            <textarea
              name="street"
              value={address.street}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            City
            <input
              name="city"
              value={address.city}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            PIN Code
            <input
              name="pincode"
              inputMode="numeric"
              value={address.pincode}
              onChange={handleChange}
              maxLength={6}
              required
            />
          </label>

          <button
            type="submit"
            className="place-order-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <section className="checkout-summary">
          <h2>Order Summary</h2>

          {cartItems.map((item) => (
            <div className="checkout-item" key={item._id}>
              <span>
                {item.title} × {item.quantity}
              </span>
              <strong>
                ₹{(Number(item.price) * item.quantity).toFixed(2)}
              </strong>
            </div>
          ))}

          <div className="checkout-total">
            <span>Subtotal</span>
            <strong>₹{totalPrice.toFixed(2)}</strong>
          </div>

          <p>Delivery charges and taxes are not included yet.</p>

          <Link to="/cart">Back to Cart</Link>
        </section>
      </div>
    </main>
  );
}

export default Checkout;
