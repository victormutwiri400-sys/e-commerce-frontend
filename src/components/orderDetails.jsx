import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import api from "./api";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [payState, setPayState] = useState({
    loading: false,
    message: "",
    error: "",
  });

  const fetchOrderDetails = useCallback(
    async (isBackground = false) => {
      if (!isBackground) setLoading(true);
      setError("");

      try {
        const [orderRes, paymentRes] = await Promise.allSettled([
          api.get(`/orders/${orderId}`),
          api.get(`/orders/${orderId}/mpesa-payment`),
        ]);

        if (orderRes.status === "fulfilled") {
          setOrder(orderRes.value.data);
        } else if (!isBackground) {
          setError(
            orderRes.reason.response?.data?.error || "Unable to load order",
          );
        }

        if (paymentRes.status === "fulfilled") {
          setPayment(paymentRes.value.data);
        } else {
          setPayment(null);
        }
      } catch (err) {
        if (!isBackground) setError("Unable to load order details");
      } finally {
        if (!isBackground) setLoading(false);
      }
    },
    [orderId],
  );

  // Initial load
  useEffect(() => {
    fetchOrderDetails(false);
  }, [fetchOrderDetails]);

  // Auto-poll status every 5 seconds if order is pending and an STK push was sent
  useEffect(() => {
    if (!order || order.status === "paid") return;

    const interval = setInterval(() => {
      fetchOrderDetails(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [order, fetchOrderDetails]);

  const handlePayment = async (event) => {
    event.preventDefault();
    setPayState({ loading: true, message: "", error: "" });

    try {
      const response = await api.post("/api/mpesa_payment", {
        order_id: Number(orderId),
        phone,
      });
      setPayState({
        loading: false,
        message:
          response.data.customer_message || "STK Push sent. Check your phone.",
        error: "",
      });
      setPhone("");
      // Immediately fetch latest payment record
      await fetchOrderDetails(true);
    } catch (err) {
      setPayState({
        loading: false,
        message: "",
        error: err.response?.data?.error || "Unable to initiate payment",
      });
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="alert alert-info">Loading order details…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <Link className="btn btn-secondary mt-3" to="/orders">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="fw-bold text-primary">Order #{order.id}</h1>
          <p className=" fw-bold text-light">
            Status:{" "}
            <span
              className={`badge ${order.status === "paid" ? "bg-success" : "bg-warning text-dark"}`}
            >
              {order.status}
            </span>
          </p>
        </div>
        <Link className="btn btn-outline-secondary" to="/products">
          Back to the store
        </Link>
      </div>

      <div className="row gy-4">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4>Order summary</h4>
              <p className="mb-1">Customer ID: {order.user_id}</p>
              <p className="mb-1 fw-bold text-primary">
                Total: KES {order.total_amount}
              </p>

              <div className="table-responsive mt-4">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Variant</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>
                          {item.color || item.size ? (
                            <span className="text-muted">
                              {item.color ? `${item.color}` : ""}
                              {item.color && item.size ? " / " : ""}
                              {item.size || ""}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>{item.quantity}</td>
                        <td>KES {item.price_at_purchase}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4>M-Pesa Payment</h4>

              {payment ? (
                <div className="mb-3 p-3 bg-light rounded">
                  <p className="mb-1">
                    <strong>Checkout Request ID:</strong>{" "}
                    {payment.checkout_request_id}
                  </p>
                  <p className="mb-1">
                    <strong>Payment status:</strong>
                    <span
                      className={`ms-2 badge ${payment.status === "paid" ? "bg-success" : "bg-secondary"}`}
                    >
                      {payment.status}
                    </span>
                  </p>
                  <p className="mb-1">
                    <strong>Receipt:</strong>{" "}
                    {payment.receipt_number || "Pending confirmation..."}
                  </p>
                </div>
              ) : (
                <div className="alert alert-warning">
                  No M-Pesa payment record initiated yet.
                </div>
              )}

              {payState.error && (
                <div className="alert alert-danger">{payState.error}</div>
              )}
              {payState.message && (
                <div className="alert alert-success">{payState.message}</div>
              )}

              {order.status !== "paid" ? (
                <form onSubmit={handlePayment} className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label">Safaricom Phone Number</label>
                    <input
                      className="form-control"
                      placeholder="2547XXXXXXXX"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4 d-grid align-items-end">
                    <button
                      className="btn btn-success"
                      type="submit"
                      disabled={payState.loading}
                    >
                      {payState.loading ? "Sending STK…" : "Pay with M-Pesa"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="alert alert-success mb-0">
                  This order has been successfully paid and verified!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card order-summary shadow-sm p-4 mb-4">
            <h5 className="mb-3">Live Sync Active</h5>
            <p className="text-muted small mb-0">
              When you complete the payment prompt on your phone, this page will
              automatically detect the confirmation and update the order status
              to <strong>paid</strong>.
            </p>
          </div>

          <div className="card order-summary shadow-sm p-4">
            <h5 className="mb-3">Quick links</h5>
            <Link className="btn btn-outline-primary w-100" to="/products">
              Browse products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
