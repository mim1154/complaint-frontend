import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import api from "../../api/axios";
import AuthLayout from "../../components/AuthLayout";

const fields = [
  { key: "name", type: "text", placeholder: "Full name", icon: FiUser },
  { key: "email", type: "email", placeholder: "Email address", icon: FiMail },
  { key: "password", type: "password", placeholder: "Password (min 6 chars)", icon: FiLock },
];

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
    <AuthLayout title="Create account ✨" subtitle="Join CityCare and make your city better">
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ key, type, placeholder, icon: Icon }) => (
          <div key={key}>
            <label className="input input-bordered flex items-center gap-2 w-full">
              <Icon className="opacity-50" />
              <input type={type} className="grow" placeholder={placeholder} value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </label>
            {errors[key] && <p className="text-error text-sm mt-1">{errors[key]}</p>}
          </div>
        ))}
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? <span className="loading loading-spinner" /> : "Sign Up"}
        </button>
        <p className="text-sm text-center">
          Already have an account? <Link to="/login" className="link link-primary font-semibold">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}