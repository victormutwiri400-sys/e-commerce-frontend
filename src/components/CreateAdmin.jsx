import { useState } from "react";
import api from "./api";

const CreateAdmin = () => {
  const [form, setForm] = useState({
    admin_email: "",
    admin_password: "",
    name: "",
    email: "",
    new_password: "",
    phone: "",
  });
  const [msg, setMsg] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/createAdmin", form, {
        withCredentials: true,
      });
      setMsg(data.message);
      setForm({
        admin_email: "",
        admin_password: "",
        name: "",
        email: "",
        new_password: "",
        phone: "",
      });
    } catch (err) {
      setMsg(
        err.response?.data?.message || err.response?.data?.error || "Failed",
      );
    }
  };

  return (
    <div className="card p-4 shadow-sm mt-4">
      <h4>Create Admin</h4>
      {msg && <div className="alert alert-info">{msg}</div>}

      <form onSubmit={submit}>
        <input
          className="form-control mb-2"
          name="admin_email"
          placeholder="Superadmin Email"
          value={form.admin_email}
          onChange={change}
          required
        />
        <input
          className="form-control mb-2"
          type="password"
          name="admin_password"
          placeholder="Superadmin Password"
          value={form.admin_password}
          onChange={change}
          required
        />
        <input
          className="form-control mb-2"
          name="name"
          placeholder="Admin Name"
          value={form.name}
          onChange={change}
          required
        />
        <input
          className="form-control mb-2"
          type="email"
          name="email"
          placeholder="Admin Email"
          value={form.email}
          onChange={change}
          required
        />
        <input
          className="form-control mb-2"
          type="password"
          name="new_password"
          placeholder="Admin Password"
          value={form.new_password}
          onChange={change}
          required
        />
        <input
          className="form-control mb-3"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={change}
        />
        <button className="btn btn-primary w-100">Create Admin</button>
      </form>
    </div>
  );
};

export default CreateAdmin;
