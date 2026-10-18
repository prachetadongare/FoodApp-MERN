import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../styles/Restaurants.css";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        console.error(err);
        setError("Unable to load restaurants. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.title?.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <main className="all-restaurants-page">
      <div className="restaurants-heading">
        <Link to="/" className="back-home-link">
          ← Back to Home
        </Link>

        <p className="section-label">EXPLORE FOOD</p>
        <h1>Find Your Restaurant</h1>
        <p>Discover restaurants and find something delicious to enjoy.</p>

        <div className="all-restaurants-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search by restaurant name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search by restaurant name"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {!loading && !error && (
          <p className="results-count">
            {filteredRestaurants.length} restaurant
            {filteredRestaurants.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {loading && <p className="restaurants-status">Loading restaurants...</p>}

      {!loading && error && (
        <div className="restaurants-status">
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filteredRestaurants.length === 0 && (
        <div className="restaurants-status">
          <h2>No restaurants found</h2>
          <p>
            {restaurants.length === 0
              ? "There are no restaurants available yet."
              : "Try another restaurant name."}
          </p>
        </div>
      )}

      {!loading && !error && filteredRestaurants.length > 0 && (
        <div className="restaurant-grid all-restaurants-grid">
          {filteredRestaurants.map((restaurant) => (
            <Link
              to={`/restaurants/${restaurant._id}`}
              className="restaurant-card restaurant-card-link"
              key={restaurant._id}
            >
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
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export default Restaurants;
