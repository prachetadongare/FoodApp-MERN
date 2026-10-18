import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API from "../services/api";
import "../styles/categories.css";
import { useCart } from "../context/useCart";

const fallbackImage = "https://placehold.co/400x300?text=Food";

function Categories() {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [foodLoading, setFoodLoading] = useState(true);
  const [error, setError] = useState("");
  const [foodError, setFoodError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  // Search input and selected category are separate.
  const selectedCategory = searchParams.get("category") || "";
  const search = searchParams.get("search") || selectedCategory;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get("/category/getAll");

        if (response.data.success) {
          setCategories(response.data.categories || []);
        } else {
          setError("Unable to load categories.");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Could not load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await API.get("/food/getAll");

        if (response.data.success) {
          setFoods(response.data.foods || []);
        } else {
          setFoodError("Unable to load food items.");
        }
      } catch (err) {
        console.error("Error fetching foods:", err);
        setFoodError("Could not load food items. Please try again.");
      } finally {
        setFoodLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // Search categories by title.
  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(search.trim().toLowerCase()),
  );

  // Display food matching the selected category.
  const filteredFoods = foods.filter((food) => {
    const matchesCategory = selectedCategory
      ? food.category?.trim().toLowerCase() ===
        selectedCategory.trim().toLowerCase()
      : true;

    return matchesCategory && food.isAvailable !== false;
  });

  const updateSearch = (value) => {
    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    setSearchParams(params, { replace: true });
  };

  const selectCategory = (title) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", title);
    setSearchParams(params);
  };

  const clearSelectedCategory = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    setSearchParams(params);
  };

  return (
    <main className="all-categories-page">
      <Link to="/" className="back-home-link">
        &larr; Back to Home
      </Link>

      <header className="all-categories-header">
        <p className="section-eyebrow">EXPLORE FOOD</p>
        <h1>Find Your Category</h1>
        <p>Discover food for every mood and craving.</p>

        <input
          type="search"
          className="category-search"
          placeholder="Search categories..."
          value={search}
          onChange={(event) => updateSearch(event.target.value)}
        />
      </header>

      <section className="category-results-section">
        <h2>Browse Categories</h2>

        {loading ? (
          <p className="category-message">Loading categories...</p>
        ) : error ? (
          <p className="category-message">{error}</p>
        ) : filteredCategories.length === 0 ? (
          <p className="category-message">
            No categories match "{search}". Try another search.
          </p>
        ) : (
          <div className="category-grid all-category-grid">
            {filteredCategories.map((category) => (
              <button
                type="button"
                className={`category-card category-select-card ${
                  selectedCategory === category.title ? "selected-category" : ""
                }`}
                key={category._id}
                onClick={() => selectCategory(category.title)}
              >
                <div className="category-image-wrapper">
                  <img
                    src={category.imageUrl || fallbackImage}
                    alt={category.title}
                    className="category-image"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackImage;
                    }}
                  />
                </div>

                <h3>{category.title}</h3>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="category-food-section">
        <div className="category-food-heading">
          <div>
            <p className="section-eyebrow">WHAT ARE YOU CRAVING?</p>
            <h2>
              {selectedCategory
                ? `${selectedCategory} Items`
                : "Explore Our Food"}
            </h2>
          </div>

          {selectedCategory && (
            <button
              type="button"
              className="clear-category-button"
              onClick={clearSelectedCategory}
            >
              Show All Food
            </button>
          )}
        </div>

        {foodLoading ? (
          <p className="category-message">Loading food items...</p>
        ) : foodError ? (
          <p className="category-message">{foodError}</p>
        ) : filteredFoods.length === 0 ? (
          <p className="category-message">
            {selectedCategory
              ? `No available food items found in ${selectedCategory}. Check the category values in your food collection.`
              : "No available food items found."}
          </p>
        ) : (
          <div className="category-food-grid">
            {filteredFoods.map((food) => (
              <article className="category-food-card" key={food._id}>
                <div className="category-food-image-wrapper">
                  <img
                    src={food.imageUrl || fallbackImage}
                    alt={food.title}
                    className="category-food-image"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackImage;
                    }}
                  />
                </div>

                <div className="category-food-info">
                  <h3>{food.title}</h3>
                  <p>{food.description}</p>

                  <div className="category-food-bottom">
                    <strong>₹{Number(food.price).toFixed(2)}</strong>
                    {food.rating && <span>★ {food.rating}</span>}
                  </div>

                  <div className="category-cart-controls">
                    {(() => {
                      const cartItem = cartItems.find(
                        (item) => item._id === food._id,
                      );

                      if (!cartItem) {
                        return (
                          <button
                            type="button"
                            className="category-add-button"
                            onClick={() => addToCart(food)}
                            disabled={food.isAvailable === false}
                          >
                            + Add to Cart
                          </button>
                        );
                      }

                      return (
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
                      );
                    })()}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Categories;
