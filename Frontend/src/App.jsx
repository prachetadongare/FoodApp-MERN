import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useCart } from "./context/useCart";
import { useAuth } from "./context/useAuth";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import Categories from "./pages/Categories";
import AdminOrders from "./pages/AdminOrders";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";

import "./App.css";

function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <Link to="/" className="logo">
            FoodApp
          </Link>

          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/restaurants">Restaurants</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/cart">Cart ({totalItems})</Link>

            {isAuthenticated ? (
              <>
                <Link to="/my-orders">My Orders</Link>

                {user?.usertype === "admin" && (
                  <Link className="navbar-admin-link" to="/admin/orders">
                    <span aria-hidden="true">⚙</span>
                    Admin Orders
                  </Link>
                )}

                <div className="navbar-user">
                  <span className="navbar-user-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21a8 8 0 0 1 16 0" strokeLinecap="round" />
                    </svg>
                  </span>

                  <span className="navbar-user-name">
                    {user?.userName || user?.name || "User"}
                  </span>
                </div>

                <button
                  type="button"
                  className="navbar-logout"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="navbar-auth-links">
                <Link to="/login" className="navbar-login">
                  Login
                </Link>

                <Link to="/register" className="navbar-register">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
