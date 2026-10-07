import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

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
      toast.success(`Welcome, ${user.name}!`);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm bg-base-100 shadow-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <div>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
        </div>

        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex justify-between text-sm">
          <Link to="/forgot-password" className="link link-primary">Forgot password?</Link>
          <Link to="/signup" className="link link-primary">Create account</Link>
        </div>
      </form>
    </div>
  );
}