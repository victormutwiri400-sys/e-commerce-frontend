import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/navbar";
import Home from "./components/home";
import Products from "./components/products";
import ProductDetails from "./components/productDetails";
import Orders from "./components/orders";
import OrderDetails from "./components/orderDetails";
import Signup from "./components/signup";
import Signin from "./components/signin";
import NotFound from "./components/notFound";
import Footer from "./components/footer";
import AdminDashboard from "./components/AdminDashboard";
import Cart from "./components/Cart";
import Wishlist from "./components/Wishlist";
import Payment from "./components/payment";
import { getSessionUser } from "./components/auth";

function App() {
  // Verify the session against the server on startup and pick up the CSRF
  // token that is minted for the session (used by authenticated requests).
  useEffect(() => {
    getSessionUser();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
