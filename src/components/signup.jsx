import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaUser } from "react-icons/fa";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({
    loading: false,
    message: "",
    error: "",
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Client-side validation mirrors the backend rules.
    if (form.password.length < 8) {
      setStatus({
        loading: false,
        message: "",
        error: "Password must be at least 8 characters long.",
      });
      return;
    }
    if (form.password !== confirmPassword) {
      setStatus({
        loading: false,
        message: "",
        error: "Passwords do not match.",
      });
      return;
    }
    setStatus({ loading: true, message: "", error: "" });

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "customer",
      };
      const response = await api.post("/users", payload, {
        withCredentials: true,
      });
      setStatus({
        loading: false,
        message: `Account created successfully for ${response.data.name || form.name}. Redirecting to sign in...`,
        error: "",
      });
      setForm({ name: "", email: "", password: "", role: "customer" });

      // Automatically redirect to signin after a short delay
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      setStatus({ loading: false, message: "", error: errorMessage });
    }
  };

  return (
    <div className="row mt-4 justify-content-center">
      <div className="col-md-6 card shadow p-4">
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {status.loading && (
            <div className="alert alert-info">Creating account…</div>
          )}
          {status.message && (
            <div className="alert alert-success">{status.message}</div>
          )}
          {status.error && (
            <div className="alert alert-danger">{status.error}</div>
          )}

          <div className="mb-3">
            <label className="form-label">
              <FaUser className="me-1" /> Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <FaEnvelope className="me-1" /> Email Address
            </label>
            <input
              type="email"
              placeholder="example@mail.com"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
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
                placeholder="Create a password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
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
            <div className="form-text text-muted">
              At least 8 characters.
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">
              <FaLock className="me-1" /> Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 mb-3">
            Sign up
          </button>

          <p className="text-center">
            Already have an account?{" "}
            <Link to="/signin" className="text-decoration-none">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
