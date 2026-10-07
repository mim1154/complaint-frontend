import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

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
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <form onSubmit={submit} className="card w-full max-w-sm bg-base-100 shadow-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>
        <div>
          <input placeholder="Reset token" className="input input-bordered w-full"
            value={token} onChange={(e) => setToken(e.target.value)} />
          {errors.token && <p className="text-error text-sm mt-1">{errors.token}</p>}
        </div>
        <div>
          <input type="password" placeholder="New password" className="input input-bordered w-full"
            value={password} onChange={(e) => setPassword(e.target.value)} />
          {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
        </div>
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset password"}
        </button>
        <p className="text-sm text-center"><Link to="/login" className="link link-primary">Back to login</Link></p>
      </form>
    </div>
  );
}