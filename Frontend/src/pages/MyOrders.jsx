import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../styles/myOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your orders.");
          return;
        }

        const response = await API.get("/food/myorders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setOrders(response.data.orders || []);
        } else {
          setError(response.data.message || "Unable to load orders.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load orders. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="my-orders-page">
        <h1>My Orders</h1>
        <p>Loading your orders...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="my-orders-page">
        <h1>My Orders</h1>
        <p className="orders-error">{error}</p>
        <Link to="/login">Go to Login</Link>
      </main>
    );
  }

  return (
    <main className="my-orders-page">
      <h1>My Orders</h1>
      <p className="orders-subtitle">
        View your order history and track order status.
      </p>

      {orders.length === 0 ? (
        <section className="empty-orders">
          <h2>No orders yet</h2>
          <p>Your placed orders will appear here.</p>
          <Link to="/restaurants">Browse Restaurants</Link>
        </section>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order._id}>
              <div className="order-header">
                <div>
                  <h2>Order Details</h2>
                  <p className="order-id">Order ID: {order._id}</p>
                  <p>
                    Date:{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <span
                  className={`order-status ${String(order.status)
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="order-foods">
                {order.items?.map((item, index) => (
                  <div
                    className="order-food-row"
                    key={`${item.food || item.title}-${index}`}
                  >
                    <span>
                      {item.title} × {item.quantity}
                    </span>
                    <strong>
                      ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <span>Total Amount</span>
                <strong>₹{Number(order.payment).toFixed(2)}</strong>
              </div>

              {order.deliveryAddress && (
                <div className="order-address">
                  <h3>Delivery Address</h3>
                  <p>{order.deliveryAddress.fullName}</p>
                  <p>{order.deliveryAddress.street}</p>
                  <p>
                    {order.deliveryAddress.city} -{" "}
                    {order.deliveryAddress.pincode}
                  </p>
                  <p>Phone: {order.deliveryAddress.phone}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <Link className="orders-back-link" to="/restaurants">
        Continue Shopping
      </Link>
    </main>
  );
}

export default MyOrders;
