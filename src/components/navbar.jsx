import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser, isAdminUser, logout } from "./auth";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const admin = isAdminUser();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.log(err);
    }
    navigate("/signin");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/" title="Back to home">
          E-Commerce
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/products"
                title="View Apparels and Books here"
              >
                TRH Store
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/cart"
                title="View your shopping cart"
              >
                Cart
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/wishlist"
                title="View your wish products"
              >
                Wishlist
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/payment"
                title="Proceed to payment"
              >
                Payment
              </NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/orders"
                  title="View your order history"
                >
                  Orders
                </NavLink>
              </li>
            )}
            {admin && (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/admin"
                  title="Admin dashboard for managing products and orders"
                >
                  Admin
                </NavLink>
              </li>
            )}
            {!user ? (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/signin"
                    title="Sign in to your account"
                  >
                    Sign in
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/signup"
                    title="Create a new account"
                  >
                    Sign up
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button
                  className="btn btn-outline-light nav-link border-0 bg-transparent"
                  onClick={handleLogout}
                  title="Logout of your account"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
