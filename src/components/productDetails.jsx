import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "./api";
import { getCurrentUser } from "./auth";
import {
  FaArrowLeft,
  FaBolt,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaSpinner,
} from "react-icons/fa";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ quantity: 1, selectedVariant: null });
  const [submitState, setSubmitState] = useState({ message: "", error: "" });
  const [progress, setProgress] = useState(0);
  const [inCart, setInCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      setProgress(30);

      try {
        setProgress(60);
        const response = await api.get(`/products/${productId}`);
        setProduct(response.data);
        setProgress(90);
        setProgress(100);
        setTimeout(() => setProgress(0), 500);
      } catch (err) {
        setError(err.response?.data?.error || "Unable to load product.");
        setProgress(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addToCart = async () => {
    if (!product) return;

    // If the product has variants, require the user to select one first
    if (product.variants?.length > 0 && !form.selectedVariant) {
      setSubmitState({
        message: "",
        error: "Please select a size / variant before adding to cart.",
      });
      return;
    }

    try {
      const res = await api.post(
        "/api/cart",
        {
          product_id: product.id,
          quantity: Number(form.quantity),
          // Send the exact variant the user picked so the cart and order
          // decrement stock from the correct variant.
          variant_id: form.selectedVariant || null,
        },
        { withCredentials: true },
      );

      setInCart(true);
      setSubmitState({
        message: res.data.message || "Added to cart successfully.",
        error: "",
      });
      setTimeout(() => setSubmitState({ message: "", error: "" }), 2500);
    } catch (err) {
      setSubmitState({
        message: "",
        error: err.response?.data?.error || "Failed to add to cart.",
      });
    }
  };

  const toggleWishlist = async () => {
    if (!product) return;

    try {
      const res = await api.post(
        "/api/wishlist",
        {
          product_id: product.id,
        },
        { withCredentials: true },
      );

      const nextState = res.data.status === "removed" ? false : true;
      setInWishlist(nextState);
      setSubmitState({
        message: res.data.message || "Wishlist updated.",
        error: "",
      });
      setTimeout(() => setSubmitState({ message: "", error: "" }), 2500);
    } catch (err) {
      setSubmitState({
        message: "",
        error: err.response?.data?.error || "Failed to update wishlist.",
      });
    }
  };

  const handleOrderNow = async () => {
    await addToCart();
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/signin");
      return;
    }
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="container py-5">
        {progress > 0 && (
          <div className="progress mb-3" style={{ height: "4px" }}>
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        )}
        <div className="card shadow-sm border-0 rounded-4 p-5 text-center">
          <div className="d-flex justify-content-center align-items-center gap-3 text-primary">
            <FaSpinner className="spinner-border" />
            <span className="fw-semibold">Loading product details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger rounded-4">{error}</div>
        <Link
          className="btn btn-outline-secondary mt-3 rounded-pill"
          to="/products"
        >
          <FaArrowLeft className="me-1" /> Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {progress > 0 && (
        <div className="progress mb-3" style={{ height: "4px" }}>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="fw-bold">{product.title}</h1>
          <p className="text-muted mb-0">
            Premium product details and quick actions.
          </p>
        </div>
        <Link className="btn btn-outline-secondary rounded-pill" to="/products">
          <FaArrowLeft className="me-1" /> Back to products
        </Link>
      </div>

      <div className="row gy-4">
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 position-relative p-3 rounded-4">
            <button
              className="btn position-absolute top-0 end-0 m-4 fs-3 bg-white rounded-circle shadow-sm border"
              onClick={toggleWishlist}
              style={{ color: inWishlist ? "#dc3545" : "#6c757d", zIndex: 10 }}
              title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {inWishlist ? <FaHeart /> : <FaRegHeart />}
            </button>
            <img
              src={product.image_url}
              className="card-img-top rounded-4"
              alt={product.title}
              style={{ maxHeight: "420px", objectFit: "contain" }}
            />
            <div className="card-body mt-3">
              <h3 className="card-title text-primary fw-bold mb-3">
                KES {product.price}
              </h3>
              <p className="card-text text-muted mb-4">
                {product.description || "No description available."}
              </p>

              {product.variants?.length > 0 && (
                <div>
                  <h5 className="mb-3">Available Variants</h5>
                  <div className="table-responsive">
                    <table className="table table-sm table-hover border">
                      <thead className="table-light">
                        <tr>
                          <th>Color</th>
                          <th>Size</th>
                          <th>Stock Available</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.variants.map((variant) => (
                          <tr
                            key={variant.id}
                            className={
                              form.selectedVariant === variant.id
                                ? "table-active"
                                : ""
                            }
                          >
                            <td>{variant.color || "—"}</td>
                            <td>{variant.size || "—"}</td>
                            <td>{variant.stock_quantity ?? 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm p-4 mb-3 border-0 rounded-4">
            <h4 className="mb-3 fw-bold">Configure Order</h4>

            {submitState.error && (
              <div className="alert alert-danger rounded-4">
                {submitState.error}
              </div>
            )}
            {submitState.message && (
              <div className="alert alert-success rounded-4">
                {submitState.message}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label fw-semibold">Quantity</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                min="1"
                max="100"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>

            {product.variants?.length > 0 && (
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Select Size / Variant
                </label>
                <select
                  className="form-select"
                  value={form.selectedVariant || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      selectedVariant: e.target.value
                        ? Number(e.target.value)
                        : null,
                    }))
                  }
                >
                  <option value="">— Choose a variant —</option>
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.color ? `${variant.color} - ` : ""}
                      {variant.size || "Standard"} ({variant.stock_quantity}{" "}
                      left)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="row g-2 mb-3">
              <div className="col-6">
                <button
                  className="btn btn-outline-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-pill"
                  onClick={addToCart}
                >
                  <FaShoppingCart /> {inCart ? "In Cart" : "Add to Cart"}
                </button>
              </div>
              <div className="col-6">
                <button
                  className="btn btn-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-pill"
                  onClick={handleOrderNow}
                >
                  <FaBolt /> Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
