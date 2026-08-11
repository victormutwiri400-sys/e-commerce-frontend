import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import {
  FaShieldAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function HomeImage({ src, alt, height }) {
  const [imageRef, setImageRef] = useState(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!imageRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" },
    );

    observer.observe(imageRef);

    return () => observer.disconnect();
  }, [imageRef]);

  return (
    <div
      ref={setImageRef}
      className="position-relative bg-light"
      style={{ height, overflow: "hidden" }}
    >
      {(!imageLoaded || imageError) && (
        <div className="position-absolute top-50 start-50 translate-middle text-center">
          {!imageError ? (
            <>
              <div
                className="spinner-border spinner-border-sm text-primary mb-2"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="text-muted small">Loading image...</div>
            </>
          ) : (
            <div className="text-muted small">Image unavailable</div>
          )}
        </div>
      )}

      {shouldLoad && !imageError && (
        <img
          className="d-block w-100"
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{
            height,
            objectFit: "cover",
            opacity: imageLoaded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      )}
    </div>
  );
}

const Home = () => {
  const navigate = useNavigate();

  const [auth] = useState(JSON.parse(localStorage.getItem("user")));
  const currentUser = auth?.role === "admin" ? auth.admin : auth?.user;

  const [contactData, setContactData] = useState({ email: "", message: "" });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactData.email || !contactData.message) {
      alert("Please provide both an email and a message.");
      return;
    }
    console.log("Message Sent:", contactData);
    alert("Thank you! Your message has been sent to Hotel Luxe.");
    setContactData({ email: "", message: "" });
  };

  return (
    <div className="container-fluid p-0 overflow-hidden">
      {/* Welcome Section */}
      <div className="text-center mb-5 mt-4 px-3">
        <h1 className="display-5 fw-bold text-light">
          Welcome,{" "}
          {currentUser
            ? currentUser.username || currentUser.name
            : "To The City Of Transformation Church"}
          !
        </h1>
        <p className="text-light fw-bold mb-0">
          Where Lives Are Transformed.
        </p>
      </div>

      {/* Floating Hero Carousel - Kept within a container for the 'float' look */}
      <div className="container pb-5">
        <Carousel
          className="shadow rounded-4 overflow-hidden mx-auto"
          style={{ maxWidth: "1100px" }}
        >
          <Carousel.Item interval={3000}>
            <HomeImage
              src="https://images.unsplash.com/photo-1720960292979-e83a74dc4586?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJlYWNoaW5nfGVufDB8fDB8fHww"
              alt="Hotel"
              height="500px"
            />
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <HomeImage
              src="https://images.unsplash.com/photo-1558541966-d1071f7329bd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJlYWNoaW5nfGVufDB8fDB8fHww"
              alt="Fountain"
              height="500px"
            />
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <HomeImage
              src="https://images.unsplash.com/photo-1622598453695-4fbaf151aadc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHdvcnNoaXBwaW5nfGVufDB8fDB8fHww"
              alt="Path"
              height="500px"
            />
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <HomeImage
              src="https://images.unsplash.com/photo-1543702404-38c2035462ad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByYXllcnxlbnwwfHwwfHx8MA%3D%3D"
              alt="Pool"
              height="500px"
            />
          </Carousel.Item>
        </Carousel>
      </div>

      {/* CONTENT SECTIONS - These now touch the margins */}
      <div className="container-fluid p-0">
        {/* Row 1: Rooms */}
        <div className="row align-items-center g-0 mb-5 pb-5 bg-primary text-light">
          <div className="col-md-6 p-0">
            <Carousel fade indicators={false} className="overflow-hidden">
              <Carousel.Item>
                <HomeImage
                  src="https://images.unsplash.com/photo-1633966887768-64f9a867bdba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRzaGlydHN8ZW58MHx8MHx8fDA%3D"
                  alt="Master Suite"
                  height="450px"
                />
              </Carousel.Item>
              <Carousel.Item>
                <HomeImage
                  src="https://media.istockphoto.com/id/483425141/photo/blank-black-t-shirt-front-with-clipping-path.webp?a=1&b=1&s=612x612&w=0&k=20&c=MGDnvpuVZT33Lb1UXv7cVjtdPMFR9XRzdyL0lm-7LXY="
                  alt="Deluxe Room"
                  height="450px"
                />
              </Carousel.Item>
            </Carousel>
          </div>
          <div className="col-md-6 px-4 px-md-5 py-4">
            <h6
              className="text-primary fw-bold text-uppercase small"
              style={{ letterSpacing: "2px" }}
            >
              Accommodation
            </h6>
            <h2 className="fw-bold mb-3">
              Luxury Redefined & Timeless Comfort
            </h2>
            <p className="text-muted mb-4">
              Our suites are sanctuary of peace amidst the vibrant energy of the
              city. Each room features contemporary architecture blended with
              classic elegance.
            </p>
            <button
              onClick={() => navigate("/rooms")}
              className="btn btn-dark rounded-pill px-5 shadow-sm"
            >
              Explore Our Suites
            </button>
          </div>
        </div>

        {/* Row 2: Dining */}
        <div className="row align-items-center g-0 mb-5 pb-5 flex-md-row-reverse bg-primary text-light">
          <div className="col-md-6 p-0">
            <Carousel fade indicators={false} className="overflow-hidden">
              <Carousel.Item>
                <HomeImage
                  src="https://media.istockphoto.com/id/1174109417/photo/cover-of-closed-copy-of-the-holy-bible-on-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=7j8LkJa6UNhXtMicaX17qnSjdXRlkLFpavHXoP3Mxp8="
                  alt="Fine Dining"
                  height="450px"
                />
              </Carousel.Item>
              <Carousel.Item>
                <HomeImage
                  src="https://media.istockphoto.com/id/168799479/photo/bible.webp?a=1&b=1&s=612x612&w=0&k=20&c=Qw6traKDKT-qfAInhkcM1S7CbGjzgIP3MaB3MpPhwgE="
                  alt="Gourmet Breakfast"
                  height="450px"
                />
              </Carousel.Item>
            </Carousel>
          </div>
          <div className="col-md-6 px-4 px-md-5 py-4 text-md-end">
            <h6
              className="text-primary fw-bold text-uppercase small"
              style={{ letterSpacing: "2px" }}
            >
              Gastronomy
            </h6>
            <h2 className="fw-bold mb-3">An Exquisite Culinary Journey</h2>
            <p className="text-muted mb-4">
              Dining at Hotel Luxe is a celebration of global flavors crafted
              with local passion using organic ingredients.
            </p>
            <button
              onClick={() => navigate("/dining")}
              className="btn btn-dark rounded-pill px-5 shadow-sm"
            >
              View Full Menu
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info Section - Margin-to-Margin */}
      <section
        className="row bg-dark p-4 p-md-5 text-light g-0"
        style={{ marginTop: "0" }}
      >
        <div className="col-md-4 px-3 mb-4 mb-md-0">
          <h4 className="mb-4" style={{ color: "#3b82f6" }}>
            About Us
          </h4>
          <p className="opacity-75">
            Our restaurant is dedicated to serving delicious meals prepared with
            fresh ingredients, friendly service and a welcoming atmosphere,
            offering customers an enjoyable dining experience.
          </p>
          <p className="opacity-75">
            Quality affordability and cleanliness come together to create
            memorable moments for families, friends and visitors every single
            day.
          </p>
        </div>

        <div className="col-md-4 px-3 mb-4 mb-md-0">
          <h4 className="text-center mb-4" style={{ color: "#3b82f6" }}>
            Contact Us
          </h4>
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
              rows="4"
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

        <div className="col-md-4 px-3">
          <h4 className="text-md-end mb-4" style={{ color: "#3b82f6" }}>
            Stay Connected
          </h4>
          <div className="d-flex justify-content-md-end gap-4 mb-4">
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
          <p className="text-md-end opacity-75">
            Stay connected with our latest restaurant specials and delicious
            updates by following our official social media pages.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
