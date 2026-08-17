import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import {
  FaCheckCircle,
  FaEye,
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaSpinner,
} from "react-icons/fa";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [message, setMessage] = useState("");
  const [wishlisted, setWishlisted] = useState({});

  const fetchWishlist = useCallback(async () => {
    try {
      const { data } = await api.get("/api/wishlist");
      const state = {};
      data.forEach((item) => (state[item.product_id] = true));
      setWishlisted(state);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/products", {
        params: {
          category: category || undefined,
          search: search || undefined,
        },
      });

      setProducts(response.data || []);
      setPage(1);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToCart = async (product) => {
    // If the product has variants, the user must pick a specific size/color.
    // Redirect to the details page so they can select the variant first.
    if (product.variants?.length > 0) {
      navigate(`/products/${product.id}`);
      return;
    }

    try {
      const res = await api.post(
        "/api/cart",
        { product_id: product.id, quantity: 1 },
        { withCredentials: true },
      );
      setMessage(res.data.message || "Added to cart successfully.");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add to cart.");
      setTimeout(() => setError(""), 2500);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const { data } = await api.post("/api/wishlist", {
        product_id: productId,
      });

      setWishlisted((prev) => ({
        ...prev,
        [productId]: data.status !== "removed",
      }));

      setMessage(data.message || "Wishlist updated.");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to update wishlist.");
    }
  };

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const visibleProducts = products.slice(startIndex, startIndex + pageSize);

  return (
    <div className="container py-5">
      {message && (
        <div className="alert alert-success d-flex align-items-center gap-2 rounded-4">
          <FaCheckCircle />
          {message}
        </div>
      )}
      {error && <div className="alert alert-danger rounded-4">{error}</div>}

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Products</h2>
          <p className="text-light mb-0">
            Browse our latest collection and save favorites instantly.
          </p>
        </div>
        <Link className="btn btn-outline-dark rounded-pill" to="/">
          Back Home
        </Link>
      </div>

      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Category</label>
              <select
                className="form-select rounded-pill"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="books">Books</option>
                <option value="apparel">Apparel</option>
              </select>
            </div>
            <div className="col-md-8">
              <label className="form-label fw-semibold">Search</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search product..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="alert alert-info rounded-4 d-flex align-items-center gap-2">
          <FaSpinner className="spinner-border spinner-border-sm" /> Loading
          products...
        </div>
      )}

      {!loading && visibleProducts.length === 0 && (
        <div className="alert alert-warning rounded-4">No products found.</div>
      )}

      <div className="row g-4">
        {visibleProducts.map((product) => (
          <div className="col-md-6 col-lg-3" key={product.id}>
            <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
              <img
                src={product.image_url}
                alt={product.title}
                className="card-img-top"
                style={{ height: "220px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="fw-bold">{product.title}</h5>
                <p className="text-muted small">{product.description}</p>
                <h4 className="text-success mb-3">KES {product.price}</h4>
                <div className="mt-auto">
                  <Link
                    to={`/products/${product.id}`}
                    className="btn btn-primary w-100 mb-2 rounded-pill"
                  >
                    <FaEye className="me-2" /> View Details
                  </Link>
                  <button
                    className="btn btn-success w-100 mb-2 rounded-pill"
                    onClick={() => addToCart(product)}
                  >
                    <FaShoppingCart className="me-2" /> Add to Cart
                  </button>
                  <button
                    className="btn btn-outline-info text-dark w-100 rounded-pill"
                    onClick={() => addToWishlist(product.id)}
                    title="click the heart icon to add to wishlist"
                  >
                    <FaHeart
                      className="me-2"
                      style={{
                        color: wishlisted[product.id] ? "red" : "white",
                      }}
                    />
                    {wishlisted[product.id] ? "Wishlisted" : "Add to Wishlist"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="mt-5">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                className={`page-item ${page === index + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${page === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Products;