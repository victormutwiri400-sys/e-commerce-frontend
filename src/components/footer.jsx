import { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const [contactData, setContactData] = useState({ email: "", message: "" });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactData.email || !contactData.message) {
      alert("Please provide both an email and a message.");
      return;
    }
    console.log("Message Sent:", contactData);
    alert(
      "Thank you! Your message has been sent to The City Of Transformation Church.",
    );
    setContactData({ email: "", message: "" });
  };

  return (
    <footer className="bg-dark text-light mt-5 py-5">
      <div className="container">
        <div className="row gy-4 justify-content-between">
          {/* About the Church */}
          <div className="col-md-6 col-lg-3">
            <h5 className="mb-3" style={{ color: "#3b82f6" }}>
              About Us
            </h5>
            <p className="opacity-75 mb-2">
              The City Of Transformation Church is a place of hope, healing and
              purpose — where lives are transformed through worship, the Word
              and a loving community.
            </p>
            <p className="opacity-75 mb-0">
              We gather to grow in faith, serve one another and share God's love
              with our city every single day.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-6 col-lg-2">
            <h5 className="mb-3" style={{ color: "#3b82f6" }}>
              Quick Links
            </h5>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li>
                <Link
                  className="text-light text-decoration-none opacity-75 hover-opacity-100"
                  to="/products"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  className="text-light text-decoration-none opacity-75 hover-opacity-100"
                  to="/orders"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  className="text-light text-decoration-none opacity-75 hover-opacity-100"
                  to="/wishlist"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  className="text-light text-decoration-none opacity-75 hover-opacity-100"
                  to="/signup"
                >
                  Sign up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="col-md-6 col-lg-4">
            <h5 className="mb-3" style={{ color: "#3b82f6" }}>
              Contact Us
            </h5>
            <form onSubmit={handleContactSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                className="form-control mb-3 bg-secondary text-white border-0 shadow-none"
                value={contactData.email}
                onChange={(e) =>
                  setContactData({ ...contactData, email: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Leave your comments"
                className="form-control mb-3 bg-secondary text-white border-0 shadow-none"
                rows="3"
                value={contactData.message}
                onChange={(e) =>
                  setContactData({ ...contactData, message: e.target.value })
                }
                required
              ></textarea>
              <button type="submit" className="btn btn-primary w-100 fw-bold">
                Send Message
              </button>
            </form>
          </div>

          {/* Stay Connected */}
          <div className="col-md-6 col-lg-3">
            <h5 className="mb-3" style={{ color: "#3b82f6" }}>
              Stay Connected
            </h5>
            <div className="d-flex gap-4 mb-3">
              <a
                href="https://www.facebook.com"
                className="text-white fs-2 opacity-75 hover-opacity-100"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.instagram.com"
                className="text-white fs-2 opacity-75 hover-opacity-100"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.twitter.com"
                className="text-white fs-2 opacity-75 hover-opacity-100"
              >
                <FaTwitter />
              </a>
            </div>
            <p className="opacity-75 mb-0">
              Stay connected with our church family through the latest news,
              events and ministry updates by following our official social media
              pages.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
