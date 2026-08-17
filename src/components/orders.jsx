import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import { isAuthenticated } from "./auth";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/signin");
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      setProgress(30);

      try {
        setProgress(60);
        const response = await api.get("/orders");
        setProgress(90);
        setOrders(response.data || []);
        setProgress(100);
        setTimeout(() => setProgress(0), 500);
      } catch (err) {
        setError(err.response?.data?.error || "Unable to load orders");
        setProgress(0);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="container py-5">
      {progress > 0 && (
        <div className="progress mb-3" style={{ height: "4px" }}>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="mb-1 fw-bold text-white">Your Orders</h1>
          <p className="fw-bold text-white mb-0">
            Review your order history and payment details.
          </p>
        </div>
        <Link className="btn btn-outline-secondary" to="/">
          Back to home
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-info">Loading orders...</div>}
      {!loading && orders.length === 0 && (
        <div className="alert alert-secondary">No orders yet.</div>
      )}

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.user_id}</td>
                <td>KES {order.total_amount}</td>
                <td>
                  <span
                    className={`badge ${order.status === "paid" ? "bg-success" : order.status === "pending" ? "bg-warning text-dark" : "bg-danger"}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  <Link
                    className="btn btn-sm btn-outline-primary"
                    to={`/orders/${order.id}`}
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
