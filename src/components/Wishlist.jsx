import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import {
  FaArrowRight,
  FaEye,
  FaHeart,
  FaSpinner,
  FaTrash,
} from "react-icons/fa";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const fetchWishlist = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/wishlist", {
        withCredentials: true,
      });
      setItems(response.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to load your wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeItem = async (itemId) => {
    setRemovingId(itemId);

    try {
      await api.delete(`/api/wishlist/${itemId}`, { withCredentials: true });
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      setError(
        err.response?.data?.error || "Unable to remove item from wishlist.",
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="card shadow-sm border-0 rounded-4 p-5 text-center">
          <div className="d-flex justify-content-center align-items-center gap-3 text-primary">
            <FaSpinner className="spinner-border" />
            <span className="fw-semibold">Loading your wishlist...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="rounded-circle bg-danger bg-opacity-10 p-3">
                  <FaHeart className="text-danger fs-5" />
                </div>
                <div>
                  <h2 className="fw-bold mb-0">My Wishlist</h2>
                  <p className="text-muted mb-0">
                    Your saved favorites are waiting for you.
                  </p>
                </div>
              </div>
            </div>
            <Link className="btn btn-outline-dark rounded-pill" to="/products">
              Continue shopping <FaArrowRight className="ms-2" />
            </Link>
          </div>

          {error ? (
            <div className="text-center py-5">
              <div className="alert alert-danger rounded-4">
                <p className="mb-3">{error}</p>
                <button
                  className="btn btn-outline-danger rounded-pill"
                  onClick={fetchWishlist}
                >
                  Try again
                </button>
              </div>
            </div>
          ) : !items.length ? (
            <div className="text-center py-5">
              <div className="display-6 text-muted mb-3">♡</div>
              <h4 className="fw-bold">Your wishlist is empty.</h4>
              <p className="text-muted mb-4">
                Save products you love and they will appear here.
              </p>
              <Link
                className="btn btn-primary rounded-pill px-4"
                to="/products"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {items.map((item) => (
                <div className="col" key={item.id}>
                  <div className="card h-100 border-0 shadow-sm rounded-4">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="card-img-top rounded-top-4"
                        style={{ height: "210px", objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold">{item.title}</h5>
                      <p className="text-success fw-bold mb-3">
                        KES {item.price}
                      </p>

                      <div className="mt-auto d-flex justify-content-between gap-2">
                        <Link
                          className="btn btn-outline-primary rounded-pill d-flex align-items-center gap-2"
                          to={`/products/${item.product_id}`}
                        >
                          <FaEye /> View
                        </Link>
                        <button
                          className="btn btn-outline-danger rounded-pill d-flex align-items-center gap-2"
                          onClick={() => removeItem(item.id)}
                          disabled={removingId === item.id}
                        >
                          {removingId === item.id ? (
                            <FaSpinner className="spinner-border spinner-border-sm" />
                          ) : (
                            <FaTrash />
                          )}
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
