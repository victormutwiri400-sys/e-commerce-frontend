import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import CreateAdmin from "./CreateAdmin";
import { isAdminUser, getCurrentUser } from "./auth";

function AdminDashboard() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [adminMsg, setAdminMsg] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [singleUserLoading, setSingleUserLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("orders");
  const [progress, setProgress] = useState(0);

  // Combined Product & Initial Variant Form
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "books",
    image_url: "",
    color: "",
    size: "",
    stock_quantity: "",
  });
  const [productMsg, setProductMsg] = useState("");

  // Create Admin form
  const [adminForm, setAdminForm] = useState({
    admin_email: "",
    admin_password: "",
    name: "",
    email: "",
    new_password: "",
    phone: "",
  });

  // Standalone Variant form (for adding extra variants to existing products)
  const [variantForm, setVariantForm] = useState({
    product_id: "",
    color: "",
    size: "",
    stock_quantity: 0,
  });
  const [variantMsg, setVariantMsg] = useState("");

  // Update product
  const [updateProductForm, setUpdateProductForm] = useState({
    id: "",
    title: "",
    description: "",
    price: "",
    image_url: "",
  });
  const [updateProductMsg, setUpdateProductMsg] = useState("");

  // Update variant
  const [updateVariantForm, setUpdateVariantForm] = useState({
    id: "",
    color: "",
    size: "",
    stock_quantity: "",
  });
  const [updateVariantMsg, setUpdateVariantMsg] = useState("");

  // Delete product
  const [deleteProductId, setDeleteProductId] = useState("");
  const [deleteProductMsg, setDeleteProductMsg] = useState("");

  // Delete variant
  const [deleteVariantId, setDeleteVariantId] = useState("");
  const [deleteVariantMsg, setDeleteVariantMsg] = useState("");

  // Get user by ID
  const [userId, setUserId] = useState("");
  const [singleUser, setSingleUser] = useState(null);

  // Update order status
  const [updateOrderId, setUpdateOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState("pending");

  useEffect(() => {
    const user = getCurrentUser();
    if (!isAdminUser()) {
      alert("Access Denied: Admins Only!");
      navigate("/");
      return;
    }
    setAuthorized(true);
    fetchAllOrders();
    fetchAllProducts();
    fetchAllUsers();
  }, [navigate]);

  const fetchAllOrders = async () => {
    setLoading(true);
    setProgress(30);
    try {
      setProgress(60);
      const response = await api.get("/orders");
      setProgress(90);
      setAllOrders(response.data || []);
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    } catch (err) {
      console.error("Order Fetch Error:", err.message);
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await api.get("/products");
      setAllProducts(response.data || []);
    } catch (err) {
      console.error("Product Fetch Error:", err.message);
      setError("Failed to load products");
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await api.get("/users");
      setAllUsers(response.data || []);
    } catch (err) {
      console.error("User Fetch Error:", err.message);
      setError("Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitProductWithVariant = async (e) => {
    e.preventDefault();
    setProductMsg("Creating product and variant...");
    try {
      // 1. Create the product first using your existing /products endpoint
      const productPayload = {
        title: productForm.title,
        description: productForm.description,
        price: productForm.price,
        category: productForm.category,
        image_url: productForm.image_url,
      };

      const productResponse = await api.post("/products", productPayload);
      const newProductId = productResponse.data.id;

      // 2. If variant details are provided, automatically submit to your /products/<id>/variants endpoint
      if (
        newProductId &&
        (productForm.color ||
          productForm.size ||
          productForm.stock_quantity !== "")
      ) {
        await api.post(`/products/${newProductId}/variants`, {
          color: productForm.color,
          size: productForm.size,
          stock_quantity: Number(productForm.stock_quantity) || 0,
        });
      }

      setProductMsg(
        `Product successfully created: ${productResponse.data.title}`,
      );
      setProductForm({
        title: "",
        description: "",
        price: "",
        category: "books",
        image_url: "",
        color: "",
        size: "",
        stock_quantity: "",
      });
      fetchAllProducts();
    } catch (err) {
      setProductMsg("Error: " + (err.response?.data?.error || err.message));
    }
  };

  const submitVariant = async (e) => {
    e.preventDefault();
    if (!variantForm.product_id) {
      setVariantMsg("Select a product first");
      return;
    }
    setVariantMsg("Creating variant...");
    try {
      await api.post(`/products/${variantForm.product_id}/variants`, {
        color: variantForm.color,
        size: variantForm.size,
        stock_quantity: Number(variantForm.stock_quantity),
      });
      setVariantMsg("Variant created successfully");
      setVariantForm({
        product_id: "",
        color: "",
        size: "",
        stock_quantity: 0,
      });
      fetchAllProducts();
    } catch (err) {
      setVariantMsg("Error: " + (err.response?.data?.error || err.message));
    }
  };

  const submitUpdateProduct = async (e) => {
    e.preventDefault();
    if (!updateProductForm.id) {
      setUpdateProductMsg("Enter product ID");
      return;
    }
    setUpdateProductMsg("Updating...");
    try {
      const payload = {};
      if (updateProductForm.title) payload.title = updateProductForm.title;
      if (updateProductForm.description)
        payload.description = updateProductForm.description;
      if (updateProductForm.price) payload.price = updateProductForm.price;
      if (updateProductForm.image_url)
        payload.image_url = updateProductForm.image_url;

      await api.put(`/products/${updateProductForm.id}`, payload);
      setUpdateProductMsg("Product updated successfully");
      setUpdateProductForm({
        id: "",
        title: "",
        description: "",
        price: "",
        image_url: "",
      });
      fetchAllProducts();
    } catch (err) {
      setUpdateProductMsg(
        "Error: " + (err.response?.data?.error || err.message),
      );
    }
  };

  const submitUpdateVariant = async (e) => {
    e.preventDefault();
    if (!updateVariantForm.id) {
      setUpdateVariantMsg("Enter variant ID");
      return;
    }
    setUpdateVariantMsg("Updating...");
    try {
      const payload = {};
      if (updateVariantForm.color) payload.color = updateVariantForm.color;
      if (updateVariantForm.size) payload.size = updateVariantForm.size;
      if (updateVariantForm.stock_quantity !== "")
        payload.stock_quantity = Number(updateVariantForm.stock_quantity);

      await api.put(`/variants/${updateVariantForm.id}`, payload);
      setUpdateVariantMsg("Variant updated successfully");
      setUpdateVariantForm({ id: "", color: "", size: "", stock_quantity: "" });
      fetchAllProducts();
    } catch (err) {
      setUpdateVariantMsg(
        "Error: " + (err.response?.data?.error || err.message),
      );
    }
  };

  const submitDeleteProduct = async (e) => {
    e.preventDefault();
    if (!deleteProductId) {
      setDeleteProductMsg("Enter product ID");
      return;
    }
    if (!window.confirm("Delete this product?")) return;
    setDeleteProductMsg("Deleting...");
    try {
      await api.delete(`/products/${deleteProductId}`);
      setDeleteProductMsg("Product deleted successfully");
      setDeleteProductId("");
      fetchAllProducts();
    } catch (err) {
      setDeleteProductMsg(
        "Error: " + (err.response?.data?.error || err.message),
      );
    }
  };

  const submitDeleteVariant = async (e) => {
    e.preventDefault();
    if (!deleteVariantId) {
      setDeleteVariantMsg("Enter variant ID");
      return;
    }
    if (!window.confirm("Delete this variant?")) return;
    setDeleteVariantMsg("Deleting...");
    try {
      await api.delete(`/variants/${deleteVariantId}`);
      setDeleteVariantMsg("Variant deleted successfully");
      setDeleteVariantId("");
      fetchAllProducts();
    } catch (err) {
      setDeleteVariantMsg(
        "Error: " + (err.response?.data?.error || err.message),
      );
    }
  };

  const handleAdmin = (e) =>
    setAdminForm({ ...adminForm, [e.target.name]: e.target.value });

  const createAdmin = async (e) => {
    e.preventDefault();
    setAdminMsg("");
    try {
      const { data } = await api.post("/api/createAdmin", adminForm);
      setAdminMsg(data.message);
    } catch (err) {
      setAdminMsg(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Something went wrong",
      );
    }
  };

  const fetchSingleUser = async () => {
    if (!userId) {
      setError("Enter user ID");
      return;
    }
    setError("");
    setSingleUserLoading(true);
    try {
      const response = await api.get(`/users/${userId}`);
      setSingleUser(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "User not found");
      setSingleUser(null);
    } finally {
      setSingleUserLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchAllOrders();
    } catch (err) {
      setError("Error updating order status");
    }
  };

  // Prefill & scroll to the Update Product form with the selected product's ID
  const handleUpdateProduct = (product) => {
    setUpdateProductForm({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
    });
    document
      .getElementById("update-product-card")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Prefill & scroll to the Update Variant form with the first variant's ID
  const handleUpdateVariant = async (product) => {
    let variants = product.variants;
    // The /products list response may not always include variants, so fetch
    // the full product detail (which always includes variants) when needed.
    if (!variants || variants.length === 0) {
      setVariantMsg(`Loading variants for "${product.title}"...`);
      try {
        const res = await api.get(`/products/${product.id}`);
        variants = res.data?.variants || [];
      } catch (err) {
        setVariantMsg(
          "Error: " + (err.response?.data?.error || err.message),
        );
        return;
      }
    }
    if (!variants || variants.length === 0) {
      alert("This product has no variants to update.");
      setVariantMsg("");
      return;
    }
    const variant = variants[0];
    setUpdateVariantForm({
      id: variant.id,
      color: variant.color || "",
      size: variant.size || "",
      stock_quantity: variant.stock_quantity ?? "",
    });
    setVariantMsg("");
    document
      .getElementById("update-variant-card")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (!authorized) return null;

  return (
    <div className="container-fluid mt-4 px-4 pb-5">
      {progress > 0 && (
        <div className="progress mb-3" style={{ height: "4px" }}>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      <h2 className="mb-4 fw-bold text-primary">E-Commerce Admin Dashboard</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="nav nav-tabs mb-4" role="tablist">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "variants" ? "active" : ""}`}
            onClick={() => setActiveTab("variants")}
          >
            Variants
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
        </li>
      </ul>

      {/* ORDERS TAB */}
      {activeTab === "orders" && (
        <div className="card shadow mb-4">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Pending Orders</h5>
            <button className="btn btn-light btn-sm" onClick={fetchAllOrders}>
              Refresh
            </button>
          </div>
          <div className="card-body">
            {loading && (
              <div className="alert alert-info">Loading orders...</div>
            )}
            {allOrders.length === 0 ? (
              <p>No orders to display.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Username</th>
                      <th>Products</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>
                          {order.username ||
                            allUsers.find((user) => user.id === order.user_id)
                              ?.name ||
                            `User #${order.user_id}`}
                        </td>
                        <td>
                          {order.items && order.items.length > 0 ? (
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={
                                  order.items[0].image_url ||
                                  "https://via.placeholder.com/40"
                                }
                                alt={order.items[0].title}
                                className="rounded border"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  objectFit: "cover",
                                }}
                              />
                              <span className="small">
                                <span className="fw-semibold d-block">
                                  {order.items[0].title}
                                </span>
                                {order.items.length > 1 && (
                                  <span className="text-muted">
                                    +{order.items.length - 1} more
                                  </span>
                                )}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>KES {order.total_amount}</td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value)
                            }
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="signed">Signed</option>
                          </select>
                        </td>
                        <td>
                          <a
                            href={`/orders/${order.id}`}
                            className="btn btn-sm btn-primary"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === "products" && (
        <>
          <div className="row g-3 mb-4">
            {/* UNIFIED ADD PRODUCT + INITIAL VARIANT FORM */}
            <div className="col-md-6">
              <div className="card shadow-sm p-4">
                <h5 className="fw-bold mb-3 text-primary">
                  Add Product & Initial Variant
                </h5>
                {productMsg && (
                  <div className="alert alert-info">{productMsg}</div>
                )}
                <form onSubmit={submitProductWithVariant}>
                  <h6 className="text-muted mb-2">Product Information</h6>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Title"
                    name="title"
                    value={productForm.title}
                    onChange={handleProductChange}
                    required
                  />
                  <textarea
                    className="form-control mb-2"
                    placeholder="Description"
                    name="description"
                    value={productForm.description}
                    onChange={handleProductChange}
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Price"
                    name="price"
                    value={productForm.price}
                    onChange={handleProductChange}
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Image URL"
                    name="image_url"
                    value={productForm.image_url}
                    onChange={handleProductChange}
                    required
                  />
                  <select
                    className="form-select mb-3"
                    name="category"
                    value={productForm.category}
                    onChange={handleProductChange}
                  >
                    <option value="books">Books</option>
                    <option value="apparel">Apparel</option>
                  </select>

                  <hr />
                  <h6 className="text-muted mb-2">
                    Initial Variant (Optional)
                  </h6>
                  <div className="row g-2 mb-3">
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Color"
                        name="color"
                        value={productForm.color}
                        onChange={handleProductChange}
                      />
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Size"
                        name="size"
                        value={productForm.size}
                        onChange={handleProductChange}
                      />
                    </div>
                    <div className="col">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Stock"
                        name="stock_quantity"
                        value={productForm.stock_quantity}
                        onChange={handleProductChange}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Save Product & Variant
                  </button>
                </form>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm p-4 mb-3" id="update-product-card">
                <h5 className="fw-bold mb-3">Update Product</h5>
                {updateProductMsg && (
                  <div className="alert alert-info">{updateProductMsg}</div>
                )}
                <form onSubmit={submitUpdateProduct}>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Product ID"
                    value={updateProductForm.id}
                    onChange={(e) =>
                      setUpdateProductForm({
                        ...updateProductForm,
                        id: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="New Title (optional)"
                    value={updateProductForm.title}
                    onChange={(e) =>
                      setUpdateProductForm({
                        ...updateProductForm,
                        title: e.target.value,
                      })
                    }
                  />
                  <textarea
                    className="form-control mb-2"
                    placeholder="New Description (optional)"
                    value={updateProductForm.description}
                    onChange={(e) =>
                      setUpdateProductForm({
                        ...updateProductForm,
                        description: e.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="New Price (optional)"
                    value={updateProductForm.price}
                    onChange={(e) =>
                      setUpdateProductForm({
                        ...updateProductForm,
                        price: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="New Image URL (optional)"
                    value={updateProductForm.image_url}
                    onChange={(e) =>
                      setUpdateProductForm({
                        ...updateProductForm,
                        image_url: e.target.value,
                      })
                    }
                  />
                  <button type="submit" className="btn btn-warning w-100">
                    Update
                  </button>
                </form>
              </div>

              <div className="card shadow-sm p-4">
                <h5 className="fw-bold mb-3">Delete Product</h5>
                {deleteProductMsg && (
                  <div className="alert alert-info">{deleteProductMsg}</div>
                )}
                <form onSubmit={submitDeleteProduct}>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Product ID"
                    value={deleteProductId}
                    onChange={(e) => setDeleteProductId(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-danger w-100">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white">
              All Products
            </div>
            <div className="card-body">
              {allProducts.length === 0 ? (
                <p>No products.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allProducts.map((product) => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>
                            <img
                              src={
                                product.image_url ||
                                "https://via.placeholder.com/40"
                              }
                              alt={product.title}
                              className="rounded border"
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>{product.title}</td>
                          <td>KES {product.price}</td>
                          <td>{product.description}</td>
                          <td>
                            <div className="dropdown">
                              <button
                                className="btn btn-sm btn-warning dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                Update
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleUpdateProduct(product)}
                                  >
                                    Update product (ID: {product.id})
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleUpdateVariant(product)}
                                  >
                                    Update variant
                                    {product.variants?.length
                                      ? ` (ID: ${product.variants[0].id})`
                                      : ""}
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* VARIANTS TAB */}
      {activeTab === "variants" && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="card shadow-sm p-4">
                <h5 className="fw-bold mb-3">Add Additional Variant</h5>
                {variantMsg && (
                  <div className="alert alert-info">{variantMsg}</div>
                )}
                <form onSubmit={submitVariant}>
                  <select
                    className="form-select mb-2"
                    value={variantForm.product_id}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        product_id: e.target.value,
                      })
                    }
                  >
                    <option value="">— Select Product —</option>
                    {allProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Color"
                    value={variantForm.color}
                    onChange={(e) =>
                      setVariantForm({ ...variantForm, color: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Size"
                    value={variantForm.size}
                    onChange={(e) =>
                      setVariantForm({ ...variantForm, size: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Stock Quantity"
                    value={variantForm.stock_quantity}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        stock_quantity: e.target.value,
                      })
                    }
                  />
                  <button type="submit" className="btn btn-primary w-100">
                    Add Variant
                  </button>
                </form>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm p-4 mb-3" id="update-variant-card">
                <h5 className="fw-bold mb-3">Update Variant</h5>
                {updateVariantMsg && (
                  <div className="alert alert-info">{updateVariantMsg}</div>
                )}
                <form onSubmit={submitUpdateVariant}>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Variant ID"
                    value={updateVariantForm.id}
                    onChange={(e) =>
                      setUpdateVariantForm({
                        ...updateVariantForm,
                        id: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="New Color (optional)"
                    value={updateVariantForm.color}
                    onChange={(e) =>
                      setUpdateVariantForm({
                        ...updateVariantForm,
                        color: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="New Size (optional)"
                    value={updateVariantForm.size}
                    onChange={(e) =>
                      setUpdateVariantForm({
                        ...updateVariantForm,
                        size: e.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="New Stock (optional)"
                    value={updateVariantForm.stock_quantity}
                    onChange={(e) =>
                      setUpdateVariantForm({
                        ...updateVariantForm,
                        stock_quantity: e.target.value,
                      })
                    }
                  />
                  <button type="submit" className="btn btn-warning w-100">
                    Update
                  </button>
                </form>
              </div>

              <div className="card shadow-sm p-4">
                <h5 className="fw-bold mb-3">Delete Variant</h5>
                {deleteVariantMsg && (
                  <div className="alert alert-info">{deleteVariantMsg}</div>
                )}
                <form onSubmit={submitDeleteVariant}>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Variant ID"
                    value={deleteVariantId}
                    onChange={(e) => setDeleteVariantId(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-danger w-100">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white">
              All Variants
            </div>
            <div className="card-body">
              {allProducts.length === 0 ? (
                <p>No variants.</p>
              ) : (
                allProducts.map(
                  (product) =>
                    product.variants &&
                    product.variants.length > 0 && (
                      <div key={product.id} className="mb-3">
                        <h6>{product.title}</h6>
                        <table className="table table-sm table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>ID</th>
                              <th>Color</th>
                              <th>Size</th>
                              <th>Stock</th>
                            </tr>
                          </thead>
                          <tbody>
                            {product.variants.map((variant) => (
                              <tr key={variant.id}>
                                <td>{variant.id}</td>
                                <td>{variant.color || "—"}</td>
                                <td>{variant.size || "—"}</td>
                                <td>{variant.stock_quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ),
                )
              )}
            </div>
          </div>
        </>
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <>
          <div className="card p-3 mb-3">
            <h5>Create Admin</h5>

            <form onSubmit={createAdmin} className="row g-2">
              {[
                ["admin_email", "Superadmin Email"],
                ["admin_password", "Superadmin Password"],
                ["name", "Admin Name"],
                ["email", "Admin Email"],
                ["new_password", "Admin Password"],
                ["phone", "Phone Number"],
              ].map(([name, placeholder]) => (
                <div className="col-md-6" key={name}>
                  <input
                    className="form-control"
                    type={name.includes("password") ? "password" : "text"}
                    name={name}
                    placeholder={placeholder}
                    value={adminForm[name]}
                    onChange={handleAdmin}
                    required={name !== "phone"}
                  />
                </div>
              ))}
              <button className="btn btn-success mt-2">Create Admin</button>
            </form>

            {adminMsg && (
              <div className="alert alert-info mt-2">{adminMsg}</div>
            )}
          </div>
          <div className="card shadow-sm mb-4 p-4">
            <h5 className="fw-bold mb-3">Get User by ID</h5>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                placeholder="Enter user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <button className="btn btn-primary" onClick={fetchSingleUser}>
                Search
              </button>
            </div>
            {singleUser && (
              <div className="mt-3 border rounded p-3">
                <p>
                  <strong>ID:</strong> {singleUser.id}
                </p>
                <p>
                  <strong>Name:</strong> {singleUser.name}
                </p>
                <p>
                  <strong>Email:</strong> {singleUser.email}
                </p>
                <p>
                  <strong>Role:</strong> {singleUser.role}
                </p>
              </div>
            )}
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">All Users</h5>
              <button className="btn btn-light btn-sm" onClick={fetchAllUsers}>
                Refresh
              </button>
            </div>
            <div className="card-body">
              {allUsers.length === 0 ? (
                <p>No users.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span
                              className={`badge ${user.role === "admin" ? "bg-danger" : "bg-primary"}`}
                            >
                              {user.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
