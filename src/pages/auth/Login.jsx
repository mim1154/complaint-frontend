import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../components/AuthLayout";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
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
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back 👋" subtitle="Login to manage your complaints">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="input input-bordered flex items-center gap-2 w-full">
            <FiMail className="opacity-50" />
            <input type="email" className="grow" placeholder="Email address" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="input input-bordered flex items-center gap-2 w-full">
            <FiLock className="opacity-50" />
            <input type="password" className="grow" placeholder="Password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
        </div>
        <div className="text-right">
          <Link to="/forgot-password" className="link link-primary text-sm">Forgot password?</Link>
        </div>
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? <span className="loading loading-spinner" /> : "Login"}
        </button>
        <p className="text-sm text-center">
          New here? <Link to="/signup" className="link link-primary font-semibold">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}