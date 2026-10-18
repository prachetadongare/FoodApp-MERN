import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import { useCart } from "../context/useCart";
import "../styles/RestaurantDetails.css";

function RestaurantDetails() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get cart data and functions from the shared CartContext
  const { cartItems, addToCart, updateQuantity, totalItems, totalPrice } =
    useCart();

  const cartCount = totalItems;
  const cartTotal = totalPrice;

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const [restaurantResponse, foodResponse] = await Promise.all([
          API.get(`/restaurant/get/${id}`),
          API.get(`/food/getByRestaurant/${id}`),
        ]);

        if (!restaurantResponse.data.success) {
          throw new Error("Restaurant details could not be loaded.");
        }

        setRestaurant(restaurantResponse.data.restaurant);
        setFoods(foodResponse.data.food || []);
      } catch (err) {
        console.error("Error loading restaurant:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load restaurant details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return <main className="details-status">Loading restaurant...</main>;
  }

  if (error || !restaurant) {
    return (
      <main className="details-status">
        <h2>Restaurant unavailable</h2>
        <p>{error || "Restaurant not found."}</p>
        <Link to="/restaurants" className="details-back-button">
          Back to Restaurants
        </Link>
      </main>
    );
  }

  const availableFoods = foods.filter((food) => food.isAvailable);

  return (
    <main className="restaurant-details-page">
      <Link to="/restaurants" className="details-back-link">
        ← All Restaurants
      </Link>

      <section className="restaurant-details-hero">
        {restaurant.imageUrl ? (
          <img
            className="details-cover-image"
            src={restaurant.imageUrl}
            alt={restaurant.title}
          />
        ) : (
          <div className="details-cover-placeholder">🍽️</div>
        )}

        <div className="details-restaurant-info">
          <span
            className={`details-open-badge ${
              restaurant.isOpen ? "is-open" : "is-closed"
            }`}
          >
            {restaurant.isOpen ? "Open now" : "Currently closed"}
          </span>

          <h1>{restaurant.title}</h1>

          <div className="details-meta">
            <span>⭐ {restaurant.rating ?? "New"}</span>
            {restaurant.time && <span>🕒 {restaurant.time}</span>}
            {restaurant.delivery && <span>Delivery available</span>}
            {restaurant.pickup && <span>Pickup available</span>}
          </div>

          {restaurant.coords?.address && (
            <p className="details-address">📍 {restaurant.coords.address}</p>
          )}
        </div>
      </section>

      <section className="menu-section">
        <div className="menu-heading">
          <div>
            <p className="menu-eyebrow">OUR MENU</p>
            <h2>Explore the Menu</h2>
            <p>Choose your favourites and add them to your cart.</p>
          </div>

          <div className="menu-count">
            {availableFoods.length} items available
          </div>
        </div>

        {foods.length === 0 ? (
          <div className="menu-empty">
            <span>🍽️</span>
            <h3>Menu coming soon</h3>
            <p>This restaurant doesn't have any food items yet.</p>
          </div>
        ) : availableFoods.length === 0 ? (
          <div className="menu-empty">
            <h3>No items currently available</h3>
            <p>Please check back later.</p>
          </div>
        ) : (
          <div className="food-grid">
            {availableFoods.map((food) => {
              // Find this food in the shared cart
              const cartItem = cartItems.find((item) => item._id === food._id);

              return (
                <article className="food-card" key={food._id}>
                  <img
                    src={food.imageUrl}
                    alt={food.title}
                    className="food-card-image"
                    loading="lazy"
                  />

                  <div className="food-card-content">
                    {food.category && (
                      <span className="food-category">{food.category}</span>
                    )}

                    <h3>{food.title}</h3>
                    <p className="food-description">{food.description}</p>

                    <div className="food-card-bottom">
                      <strong>₹{Number(food.price).toFixed(2)}</strong>

                      {!cartItem ? (
                        <button
                          type="button"
                          className="add-food-button"
                          onClick={() => addToCart(food)}
                        >
                          + Add
                        </button>
                      ) : (
                        <div className="quantity-control">
                          <button
                            type="button"
                            aria-label={`Remove one ${food.title}`}
                            onClick={() =>
                              updateQuantity(food._id, cartItem.quantity - 1)
                            }
                            disabled={cartItem.quantity <= 1}
                          >
                            −
                          </button>

                          <span>{cartItem.quantity}</span>

                          <button
                            type="button"
                            aria-label={`Add one ${food.title}`}
                            onClick={() => addToCart(food)}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {cartCount > 0 && (
        <aside className="cart-summary">
          <div>
            <strong>
              {cartCount} item{cartCount !== 1 ? "s" : ""} in cart
            </strong>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>

          <Link to="/cart" className="details-back-button">
            View Cart
          </Link>
        </aside>
      )}
    </main>
  );
}

export default RestaurantDetails;
