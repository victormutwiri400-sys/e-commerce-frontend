import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import { saveCurrentUser } from "./auth";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading("Logging in...");
    setError("");
    setSuccess("");

    try {
      const { data } = await api.post("/api/signin", { email, password });
      const currentUser = data.user || data.admin;

      saveCurrentUser({ ...currentUser, role: data.role });

      setSuccess("Login successful!");
      setTimeout(
        () => navigate(data.role === "admin" ? "/admin" : "/products"),
        1000,
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed.",
      );
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="row mt-4 justify-content-center">
      <div className="col-md-6 p-4 card shadow">
        <h2 className="text-center mb-4">Sign In</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="alert alert-info">{loading}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleLoginSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <FaEnvelope className="me-1" /> Email Address
            </label>
            <input
              type="email"
              placeholder="example@mail.com"
              className="form-control"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <FaLock className="me-1" /> Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="form-control"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 mb-3">
            Sign in
          </button>

          <p className="text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-decoration-none">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;
