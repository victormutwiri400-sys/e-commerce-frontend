import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-light mt-5 py-4">
      <div className="container">
        <div className="row gy-3 justify-content-between align-items-center">
          <div className="col-md-6">
            <h5 className="mb-1">E-Commerce Store</h5>
            <p className="mb-0 text-light-emphasis">
              Modern shopping experience powered by React and your API.
            </p>
          </div>
          <div className="col-md-4 text-md-end">
            <div className="d-flex flex-wrap gap-3 justify-content-md-end">
              <Link className="text-light text-decoration-none" to="/products">
                Products
              </Link>
              <Link className="text-light text-decoration-none" to="/orders">
                Orders
              </Link>
              <Link className="text-light text-decoration-none" to="/signup">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
