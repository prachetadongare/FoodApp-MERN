import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    usertype: "",
    answer: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await registerUser(form);

      if (!data.success) {
        setError(data.message || "Registration failed.");
        return;
      }

      setMessage(data.message || "Registration successful!");

      // Registration does not automatically log the user in.
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to register. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Create Account</h1>
      <p className="form-description">Register for your FoodApp account.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="userName">Full Name</label>
        <input
          id="userName"
          name="userName"
          value={form.userName}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />

        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Create a password"
          required
        />

        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          required
        />

        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Enter your address"
          required
        />

        <label htmlFor="usertype">Account Type</label>
        <select
          id="usertype"
          name="usertype"
          value={form.usertype}
          onChange={handleChange}
          required
        >
          <option value="">Select account type</option>
          <option value="client">Customer</option>
          <option value="vendor">Restaurant Owner</option>
          <option value="driver">Delivery Partner</option>
        </select>

        <label htmlFor="answer">Recovery Answer</label>
        <input
          id="answer"
          name="answer"
          value={form.answer}
          onChange={handleChange}
          placeholder="Enter your recovery answer"
          required
        />

        {/*
          Keep the account type fixed to a normal user.
          Do not let public registration create admin accounts.
        */}

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Create Account"}
        </button>
      </form>

      <p className="form-footer">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
