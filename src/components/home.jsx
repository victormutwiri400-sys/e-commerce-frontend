import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
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
        <p className="text-light fw-bold mb-0">Where Lives Are Transformed.</p>
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
              alt="Praise & Worship"
              height="500px"
            />
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <HomeImage
              src="https://images.unsplash.com/photo-1558541966-d1071f7329bd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJlYWNoaW5nfGVufDB8fDB8fHww"
              alt="Fellowship"
              height="500px"
            />
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <HomeImage
              src="https://images.unsplash.com/photo-1622598453695-4fbaf151aadc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHdvcnNoaXBwaW5nfGVufDB8fDB8fHww"
              alt="Worship"
              height="500px"
            />
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <HomeImage
              src="https://images.unsplash.com/photo-1543702404-38c2035462ad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByYXllcnxlbnwwfHwwfHx8MA%3D%3D"
              alt="Prayer"
              height="500px"
            />
          </Carousel.Item>
        </Carousel>
      </div>

      {/* CONTENT SECTIONS - These now touch the margins */}
      <div className="container-fluid p-0">
        {/* Row 1: Church Apparel */}
        <div className="row align-items-center g-0 mb-5 pb-5 bg-primary text-light">
          <div className="col-md-6 p-0">
            <Carousel fade indicators={false} className="overflow-hidden">
              <Carousel.Item>
                <HomeImage
                  src="https://images.unsplash.com/photo-1633966887768-64f9a867bdba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRzaGlydHN8ZW58MHx8MHx8fDA%3D"
                  alt="Church T-Shirts"
                  height="450px"
                />
              </Carousel.Item>
              <Carousel.Item>
                <HomeImage
                  src="https://media.istockphoto.com/id/483425141/photo/blank-black-t-shirt-front-with-clipping-path.webp?a=1&b=1&s=612x612&w=0&k=20&c=MGDnvpuVZT33Lb1UXv7cVjtdPMFR9XRzdyL0lm-7LXY="
                  alt="Blank T-Shirt"
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
              Merchandise
            </h6>
            <h2 className="fw-bold mb-3">Wear Your Faith In Style</h2>
            <p className="text-muted mb-4">
              Explore our collection of church t-shirts and apparel designed to
              let you share your faith with confidence. Each piece is crafted
              with comfort, quality and purpose in mind.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="btn btn-dark rounded-pill px-5 shadow-sm"
            >
              Shop The Collection
            </button>
          </div>
        </div>

        {/* Row 2: The Word */}
        <div className="row align-items-center g-0 mb-5 pb-5 flex-md-row-reverse bg-primary text-light">
          <div className="col-md-6 p-0">
            <Carousel fade indicators={false} className="overflow-hidden">
              <Carousel.Item>
                <HomeImage
                  src="https://media.istockphoto.com/id/1174109417/photo/cover-of-closed-copy-of-the-holy-bible-on-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=7j8LkJa6UNhXtMicaX17qnSjdXRlkLFpavHXoP3Mxp8="
                  alt="The Holy Bible"
                  height="450px"
                />
              </Carousel.Item>
              <Carousel.Item>
                <HomeImage
                  src="https://media.istockphoto.com/id/168799479/photo/bible.webp?a=1&b=1&s=612x612&w=0&k=20&c=Qw6traKDKT-qfAInhkcM1S7CbGjzgIP3MaB3MpPhwgE="
                  alt="Scripture"
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
              Bible Teaching
            </h6>
            <h2 className="fw-bold mb-3">Growing In Faith Through The Word</h2>
            <p className="text-muted mb-4">
              Join our bible studies and teaching sessions where the Word of God
              is shared with clarity and love, helping us grow in faith together
              as one church family.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="btn btn-dark rounded-pill px-5 shadow-sm"
            >
              Browse Bibles & Books
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
