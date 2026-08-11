import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "./auth";
import {
  FaArrowLeft,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaSpinner,
  FaTrash,
} from "react-icons/fa";
import api from "./api";

const Cart = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/cart", { withCredentials: true });
      setItems(response.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to load your cart.");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/api/cart/${id}`, { withCredentials: true });
      setItems((prev) => prev.filter((item) => item.id !== id));
      setMessage("Item removed successfully.");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to remove item.");
    }
  };

  const increaseQuantity = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Number(item.quantity) + 1 }
          : item,
      ),
    );
  };

  const decreaseQuantity = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                Number(item.quantity) > 1 ? Number(item.quantity) - 1 : 1,
            }
          : item,
      ),
    );
  };

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );

  const checkout = async () => {
    if (!items.length) {
      return;
    }

    setProcessing(true);
    setError("");

    try {
      // Fetch user using your auth helper to correctly target the "user" localStorage key
      const currentUser = getCurrentUser();

      if (!currentUser || !currentUser.id) {
        setError("User session not found. Please sign in again.");
        setProcessing(false);
        return;
      }

      const payload = {
        user_id: currentUser.id,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post("/orders", payload, {
        withCredentials: true,
      });

      const orderId = response.data.id;
      setMessage(`Order #${orderId} placed successfully.`);
      setItems([]);
      
      setTimeout(() => navigate('/payment', { state: { orderId } }), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Checkout failed.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="card shadow-sm border-0 rounded-4 p-5 text-center">
          <div className="d-flex justify-content-center align-items-center gap-3 text-primary">
            <FaSpinner className="spinner-border" />
            <span className="fw-semibold">Loading your cart...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-success d-flex align-items-center gap-2">
            <FaShoppingCart className="text-primary" /> Shopping Cart
          </h2>
          <p className="fw-bold text-white mb-0">
            Review your selected products and complete checkout.
          </p>
        </div>
        <Link className="btn btn-outline-dark rounded-pill" to="/products" title="Continue shopping">
          <FaArrowLeft className="me-2" /> Continue Shopping
        </Link>
      </div>

      {message && (
        <div className="alert alert-success rounded-4">{message}</div>
      )}
      {error && <div className="alert alert-danger rounded-4">{error}</div>}

      {!items.length ? (
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body text-center py-5">
            <div className="display-6 mb-3">🛒</div>
            <h4 className="fw-bold">Your cart is empty.</h4>
            <p className="text-muted mb-4">
              Add a few favorites and they will appear here.
            </p>
            <Link className="btn btn-primary rounded-pill px-4" to="/products">
              Browse products
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="row align-items-center border-bottom py-3 g-3"
                  >
                    <div className="col-md-2 text-center">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="img-fluid rounded-4"
                        style={{
                          width: "90px",
                          height: "90px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className="col-md-4">
                      <h5 className="fw-bold">{item.title}</h5>
                      <p className="text-success fw-bold mb-0">
                        KES {item.price}
                      </p>
                    </div>
                    <div className="col-md-3">
                      <div className="d-flex justify-content-center align-items-center">
                        <button
                          className="btn btn-outline-secondary rounded-circle"
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          <FaMinus />
                        </button>
                        <span className="mx-3 fw-bold">{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary rounded-circle"
                          onClick={() => increaseQuantity(item.id)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                    <div className="col-md-2 text-center">
                      <h6 className="text-primary mb-0">
                        KES {Number(item.price) * Number(item.quantity)}
                      </h6>
                    </div>
                    <div className="col-md-1 text-end">
                      <button
                        className="btn btn-danger rounded-circle"
                        onClick={() => removeItem(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-lg border-0 rounded-4 sticky-top">
              <div className="card-body">
                <h4 className="mb-4 fw-bold">Order Summary</h4>
                <div className="d-flex justify-content-between mb-3">
                  <span>Items</span>
                  <strong>{items.length}</strong>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Total</span>
                  <strong className="text-success">KES {total}</strong>
                </div>
                <hr />
                <button
                  className="btn btn-success w-100 py-2 rounded-pill"
                  disabled={processing}
                  onClick={checkout}
                >
                  {processing ? "Processing..." : "Checkout"}
                </button>
                <Link
                  to="/products"
                  className="btn btn-outline-dark w-100 mt-3 rounded-pill"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
