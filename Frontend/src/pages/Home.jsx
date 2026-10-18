import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import CategorySection from "../components/CategorySection";
import { useCart } from "../context/useCart";
import "../styles/RestaurantDetails.css";
import { useAuth } from "../context/useAuth";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [foods, setFoods] = useState([]);
  const [foodLoading, setFoodLoading] = useState(true);
  const [foodError, setFoodError] = useState("");

  const { cartItems, addToCart, updateQuantity } = useCart();

  const { isAuthenticated } = useAuth();
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await API.get("/restaurant/getAll");

        if (response.data.success) {
          setRestaurants(response.data.restaurants || []);
        } else {
          setError("Could not load restaurants.");
        }
      } catch (err) {
        console.error("Error loading restaurants:", err);
        setError("Unable to load restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchFoods = async () => {
      try {
        const response = await API.get("/food/getAll");

        if (response.data.success) {
          setFoods(response.data.foods || []);
        } else {
          setFoodError("Could not load food items.");
        }
      } catch (err) {
        console.error("Error loading foods:", err);
        setFoodError("Unable to load food items. Please try again later.");
      } finally {
        setFoodLoading(false);
      }
    };

    fetchRestaurants();
    fetchFoods();
  }, []);

  const featuredRestaurants = restaurants.slice(0, 6);

  const popularFoods = foods
    .filter((food) => food.isAvailable !== false)
    .slice(0, 6);

  return (
    <div className="page-container">
      <section className="hero">
        <p className="hero-subtitle">GOOD FOOD, GOOD MOOD</p>

        <h1>
          Delicious food,
          <br />
          delivered to you.
        </h1>

        <p className="hero-description">
          Discover your favourite dishes and restaurants with FoodApp.
        </p>

        <div className="hero-actions">
          <Link to="/restaurants" className="explore-link">
            Search Restaurants
          </Link>

          {!isAuthenticated && (
            <Link to="/register" className="hero-secondary-button">
              Get Started
            </Link>
          )}
        </div>
      </section>

      <CategorySection />

      <section className="home-section restaurant-section">
        <div className="section-heading">
          <div>
            <h2>Popular Restaurants</h2>
            <p>Handpicked places for your next delicious meal.</p>
          </div>

          <Link to="/restaurants" className="view-all-link">
            View All Restaurants →
          </Link>
        </div>

        {loading && <p className="coming-soon">Loading restaurants...</p>}

        {!loading && error && <p className="error-message">{error}</p>}

        {!loading && !error && restaurants.length === 0 && (
          <p className="coming-soon">No restaurants available yet.</p>
        )}

        {!loading && !error && featuredRestaurants.length > 0 && (
          <>
            <div className="restaurant-grid">
              {featuredRestaurants.map((restaurant) => (
                <article className="restaurant-card" key={restaurant._id}>
                  <div className="restaurant-image">
                    {restaurant.imageUrl ? (
                      <img
                        src={restaurant.imageUrl}
                        alt={restaurant.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="image-placeholder">🍽️</div>
                    )}

                    <span
                      className={`status-badge ${
                        restaurant.isOpen ? "open" : "closed"
                      }`}
                    >
                      {restaurant.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>

                  <div className="restaurant-info">
                    <h3>{restaurant.title}</h3>

                    <div className="restaurant-meta">
                      <span>⭐ {restaurant.rating ?? "New"}</span>
                      {restaurant.time && <span>🕒 {restaurant.time}</span>}
                    </div>

                    {Array.isArray(restaurant.foods) &&
                      restaurant.foods.length > 0 && (
                        <p className="restaurant-foods">
                          {restaurant.foods
                            .map((food) =>
                              typeof food === "string"
                                ? food
                                : food?.name || food?.title || food?.foodName,
                            )
                            .filter(Boolean)
                            .slice(0, 3)
                            .join(" · ")}
                        </p>
                      )}

                    <div className="restaurant-footer">
                      {restaurant.delivery
                        ? "Delivery available"
                        : restaurant.pickup
                          ? "Pickup available"
                          : "Check availability"}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {restaurants.length > 6 && (
              <div className="view-all-bottom">
                <Link to="/restaurants" className="explore-link">
                  Explore All {restaurants.length} Restaurants
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      <section className="home-section popular-food-section">
        <div className="section-heading">
          <div>
            <h2>Popular Food</h2>
            <p>Your favourite dishes, all in one place.</p>
          </div>

          <Link to="/categories" className="view-all-link">
            Explore All Food →
          </Link>
        </div>

        {foodLoading && <p className="coming-soon">Loading food items...</p>}

        {!foodLoading && foodError && (
          <p className="error-message">{foodError}</p>
        )}

        {!foodLoading && !foodError && popularFoods.length === 0 && (
          <p className="coming-soon">No food items are available right now.</p>
        )}

        {!foodLoading && !foodError && popularFoods.length > 0 && (
          <div className="food-grid">
            {popularFoods.map((food) => {
              const cartItem = cartItems.find((item) => item._id === food._id);

              return (
                <article className="food-card" key={food._id}>
                  <img
                    className="food-card-image"
                    src={food.imageUrl}
                    alt={food.title}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
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
    </div>
  );
}

export default Home;
