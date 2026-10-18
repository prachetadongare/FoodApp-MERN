import { useCallback, useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/useAuth";
import "../styles/AdminOrders.css";

const STATUSES = ["preparing", "on the way", "delivered"];

function AdminOrders() {
  const { user, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const isAdmin = isAuthenticated && user?.usertype === "admin";

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/food/allorders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedOrders = response.data.orders || [];

      setOrders(fetchedOrders);
      setError("");

      setSelectedStatuses((previous) => {
        const next = { ...previous };

        fetchedOrders.forEach((order) => {
          if (!(order._id in next)) {
            next[order._id] = order.status;
          }
        });

        return next;
      });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    let cancelled = false;

    const loadOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await API.get("/food/allorders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (cancelled) return;

        const fetchedOrders = response.data.orders || [];

        setOrders(fetchedOrders);
        setError("");

        setSelectedStatuses((previous) => {
          const next = { ...previous };

          fetchedOrders.forEach((order) => {
            if (!(order._id in next)) {
              next[order._id] = order.status;
            }
          });

          return next;
        });
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Unable to load orders.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const updateStatus = async (orderId) => {
    const status = selectedStatuses[orderId];

    if (!STATUSES.includes(status)) {
      setError("Please select a valid order status.");
      return;
    }

    try {
      setUpdatingId(orderId);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await API.post(
        `/food/orderStatus/${orderId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const updatedOrder = response.data.order;

      if (updatedOrder) {
        setOrders((previous) =>
          previous.map((order) =>
            order._id === orderId ? updatedOrder : order,
          ),
        );
      } else {
        await fetchOrders();
      }

      setMessage("Order status updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update the order status.",
      );
    } finally {
      setUpdatingId("");
    }
  };

  if (!isAdmin) {
    return (
      <main className="admin-page">
        <section className="admin-access-denied">
          <h1>Admin access required</h1>
          <p>Please log in with your admin account to manage orders.</p>
        </section>
      </main>
    );
  }

  const countStatus = (status) =>
    orders.filter((order) => order.status === status).length;

  if (loading) {
    return (
      <main className="admin-page">
        <p className="admin-notice">Loading orders...</p>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-heading">
        <div>
          <p className="admin-eyebrow">FOODAPP CONTROL CENTER</p>
          <h1>Order Management</h1>
          <p>Track orders and keep customers updated.</p>
        </div>

        <button
          className="admin-refresh"
          onClick={() => {
            setLoading(true);
            setError("");
            setMessage("");
            fetchOrders();
          }}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Orders"}
        </button>
      </header>

      {error && <div className="admin-alert error">{error}</div>}
      {message && <div className="admin-alert success">{message}</div>}

      <section className="admin-stats">
        <article className="admin-stat">
          <span>Total orders</span>
          <strong>{orders.length}</strong>
        </article>

        <article className="admin-stat">
          <span>Preparing</span>
          <strong>{countStatus("preparing")}</strong>
        </article>

        <article className="admin-stat">
          <span>On the way</span>
          <strong>{countStatus("on the way")}</strong>
        </article>

        <article className="admin-stat">
          <span>Delivered</span>
          <strong>{countStatus("delivered")}</strong>
        </article>
      </section>

      <section className="admin-orders-section">
        <div className="admin-section-heading">
          <h2>All Orders</h2>
          <span>{orders.length} orders</span>
        </div>

        {orders.length === 0 ? (
          <div className="admin-empty">
            <h3>No orders yet</h3>
            <p>Customer orders will appear here.</p>
          </div>
        ) : (
          <div className="admin-order-list">
            {orders.map((order) => (
              <article className="admin-order-card" key={order._id}>
                <div className="admin-order-top">
                  <div>
                    <span className="admin-order-label">ORDER ID</span>
                    <h3>{order._id}</h3>
                    <p>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("en-IN")
                        : "Date unavailable"}
                    </p>
                  </div>

                  <span
                    className={`admin-status status-${(
                      order.status || "unknown"
                    ).replaceAll(" ", "-")}`}
                  >
                    {order.status || "Unknown"}
                  </span>
                </div>

                <div className="admin-order-details">
                  <div className="admin-customer">
                    <h4>Customer</h4>
                    <p>{order.buyer?.userName || "Customer"}</p>
                    <p>{order.buyer?.email || "Email unavailable"}</p>
                  </div>

                  <div className="admin-items">
                    <h4>Order items</h4>
                    {order.items?.map((item, index) => (
                      <p key={`${order._id}-${index}`}>
                        {item.title} × {item.quantity}{" "}
                        <span>
                          ₹{Number(item.price) * Number(item.quantity)}
                        </span>
                      </p>
                    ))}
                  </div>

                  <div className="admin-total">
                    <h4>Total amount</h4>
                    <strong>₹{order.payment}</strong>
                  </div>
                </div>

                {order.deliveryAddress && (
                  <div className="admin-delivery">
                    <h4>Delivery address</h4>
                    <p>
                      {order.deliveryAddress.fullName},{" "}
                      {order.deliveryAddress.street},{" "}
                      {order.deliveryAddress.city} -{" "}
                      {order.deliveryAddress.pincode}
                    </p>
                    <p>Phone: {order.deliveryAddress.phone}</p>
                  </div>
                )}

                <div className="admin-status-controls">
                  <label htmlFor={`status-${order._id}`}>
                    Update order status
                  </label>

                  <select
                    id={`status-${order._id}`}
                    value={selectedStatuses[order._id] || order.status}
                    onChange={(event) =>
                      setSelectedStatuses((previous) => ({
                        ...previous,
                        [order._id]: event.target.value,
                      }))
                    }
                  >
                    {!STATUSES.includes(order.status) && (
                      <option value={order.status}>
                        {order.status} (legacy status)
                      </option>
                    )}

                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <button
                    className="admin-update-button"
                    onClick={() => updateStatus(order._id)}
                    disabled={
                      updatingId === order._id ||
                      selectedStatuses[order._id] === order.status
                    }
                  >
                    {updatingId === order._id ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminOrders;
