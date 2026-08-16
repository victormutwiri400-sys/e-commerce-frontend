import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "./api";
import { FaMobileAlt, FaLock, FaCheckCircle, FaShareAlt } from "react-icons/fa";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [orderId, setOrderId] = useState(location.state?.orderId || "");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);

  const [orderItems, setOrderItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [showAllItems, setShowAllItems] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState("");

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`, {
        withCredentials: true,
      });
      setOrderItems(response.data.items || []);
      setOrderTotal(response.data.total_amount || 0);
    } catch (err) {
      console.error("Could not fetch order items for preview", err);
    }
  };

  const handleMpesaPayment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessData(null);

    if (!orderId || !phone) {
      setError("Please provide both an Order ID and a phone number.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/api/mpesa_payment",
        { order_id: Number(orderId), phone: phone.trim() },
        { withCredentials: true },
      );

      setSuccessData(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.details ||
          "Failed to initiate M-Pesa payment.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAskAFriend = () => {
    const paymentLink = `${window.location.origin}/payment`;
    const shareText = `Hey! Could you please help me pay for my order #${orderId} (KES ${orderTotal}) on our store using this link: ${paymentLink}?`;

    if (navigator.share) {
      navigator
        .share({
          title: `Pay Order #${orderId}`,
          text: shareText,
          url: paymentLink,
        })
        .catch(() => {
          copyToClipboard(shareText);
        });
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback("Payment link copied to clipboard!");
    setTimeout(() => setCopyFeedback(""), 3000);
  };

  const displayedItems = showAllItems ? orderItems : orderItems.slice(0, 2);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        {/* Expanded max-width column to fit horizontal cards comfortably */}
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm p-4">
            <div className="text-center mb-4">
              <div className="bg-success text-white rounded-circle d-inline-flex p-3 mb-2">
                <FaMobileAlt size={28} />
              </div>
              <h2 className="h4 mb-1">Lipa na M-Pesa</h2>
              <p className="text-muted small">
                Complete your checkout securely via STK push.
              </p>
            </div>

            {/* Order Items Preview Section */}
            {orderItems.length > 0 && !successData && (
              <div className="card bg-light border-0 p-3 mb-4 rounded-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold text-secondary">Order Preview</span>
                  <span className="badge bg-success fs-6">
                    KES {Number(orderTotal).toLocaleString()}
                  </span>
                </div>

                {/* Horizontal Layout for items */}
                <div className="d-flex flex-column gap-3">
                  {displayedItems.map((item, index) => (
                    <div
                      key={index}
                      className="card border-0 shadow-sm p-3 bg-white flex-row align-items-center gap-3 rounded-3"
                    >
                      <img
                        src={item.image_url || "https://via.placeholder.com/80"}
                        alt={item.title}
                        className="rounded-3 border"
                        style={{
                          width: "75px",
                          height: "75px",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-bold text-dark">{item.title}</h6>
                        {item.color || item.size ? (
                          <p className="mb-1 text-muted small">
                            {item.color ? `${item.color}` : ""}
                            {item.color && item.size ? " / " : ""}
                            {item.size || ""}
                          </p>
                        ) : null}
                        <p className="mb-1 text-muted small">
                          Quantity: {item.quantity}
                        </p>
                        <div className="fw-semibold text-success">
                          KES{" "}
                          {Number(
                            item.price_at_purchase * item.quantity,
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {orderItems.length > 2 && (
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-decoration-none text-success mt-3 p-0 align-self-start fw-semibold"
                    onClick={() => setShowAllItems(!showAllItems)}
                  >
                    {showAllItems
                      ? "Show Less"
                      : `View All Products (${orderItems.length} items)...`}
                  </button>
                )}
              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}
            {copyFeedback && (
              <div className="alert alert-info py-2 small">{copyFeedback}</div>
            )}

            {successData ? (
              <div className="alert alert-success text-center py-4">
                <FaCheckCircle size={40} className="mb-2 text-success" />
                <h5 className="fw-bold">STK Push Sent!</h5>
                <p>{successData.customer_message || successData.message}</p>
                <hr />
                <p className="mb-1">
                  <strong>Order:</strong> #{successData.order_id}
                </p>
                <p className="mb-3">
                  <strong>Amount:</strong> KES{" "}
                  {Number(successData.amount).toLocaleString()}
                </p>
                <button
                  className="btn btn-outline-success w-100"
                  onClick={() => navigate("/orders")}
                >
                  View Orders
                </button>
              </div>
            ) : (
              <form onSubmit={handleMpesaPayment}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Order ID</label>
                  <input
                    type="number"
                    className="form-control bg-light"
                    value={orderId}
                    disabled
                    readOnly
                  />
                  <div className="form-text text-muted">
                    Order ID is locked for this transaction.
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Safaricom Phone Number
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">+254</span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="712345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4 text-end">
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 text-decoration-none d-inline-flex align-items-center gap-1 text-primary fw-semibold"
                    onClick={handleAskAFriend}
                  >
                    <FaShareAlt size={12} /> Ask a friend to pay for this order
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sending STK Push...
                    </>
                  ) : (
                    <>
                      <FaLock size={14} /> Pay with M-Pesa
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
