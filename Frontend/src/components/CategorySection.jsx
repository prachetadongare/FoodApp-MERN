import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../styles/categories.css";

const fallbackImage = "https://placehold.co/400x300?text=Food+Category";

function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <section className="categories-section">
      <div className="categories-heading">
        <div>
          <p className="section-eyebrow">EXPLORE BY TASTE</p>
          <h2>Browse Categories</h2>
          <p>Find something delicious for every craving.</p>
        </div>

        <Link to="/categories" className="view-all-link">
          View All &rarr;
        </Link>
      </div>

      {loading ? (
        <p className="category-message">Loading categories...</p>
      ) : error ? (
        <p className="category-message">{error}</p>
      ) : categories.length === 0 ? (
        <p className="category-message">
          No categories found. Add categories to your database first.
        </p>
      ) : (
        <div className="category-grid">
          {categories.slice(0, 4).map((category) => (
            <Link
              to={`/categories?category=${encodeURIComponent(category.title)}`}
              className="category-card"
              key={category._id}
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
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default CategorySection;
