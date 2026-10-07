import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/auth/signup", form);
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm bg-base-100 shadow-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>

        {["name", "email", "password"].map((field) => (
          <div key={field}>
            <input
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              className="input input-bordered w-full"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
            {errors[field] && <p className="text-error text-sm mt-1">{errors[field]}</p>}
          </div>
        ))}

        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-sm text-center">
          Already have an account? <Link to="/login" className="link link-primary">Login</Link>
        </p>
      </form>
    </div>
  );
}