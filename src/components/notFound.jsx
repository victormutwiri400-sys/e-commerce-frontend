import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-5">Page not found</h1>
      <p className="lead text-muted">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Return home
      </Link>
    </div>
  );
}
