import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiKey, FiLock } from "react-icons/fi";
import api from "../../api/axios";
import AuthLayout from "../../components/AuthLayout";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [token, setToken] = useState(params.get("token") || "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!token.trim()) err.token = "Token is required";
    if (password.length < 6) err.password = "Password must be at least 6 characters";
    setErrors(err);
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, new_password: password });
      toast.success("Password reset! Please login.");
      navigate("/login");
    } catch (e2) {
      toast.error(e2.response?.data?.detail || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset password 🔒" subtitle="Choose a new password for your account">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="input input-bordered flex items-center gap-2 w-full">
            <FiKey className="opacity-50" />
            <input className="grow" placeholder="Reset token" value={token}
              onChange={(e) => setToken(e.target.value)} />
          </label>
          {errors.token && <p className="text-error text-sm mt-1">{errors.token}</p>}
        </div>
        <div>
          <label className="input input-bordered flex items-center gap-2 w-full">
            <FiLock className="opacity-50" />
            <input type="password" className="grow" placeholder="New password" value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </label>
          {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
        </div>
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? <span className="loading loading-spinner" /> : "Reset password"}
        </button>
        <p className="text-sm text-center">
          <Link to="/login" className="link link-primary">Back to login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}