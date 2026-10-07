import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail } from "react-icons/fi";
import api from "../../api/axios";
import AuthLayout from "../../components/AuthLayout";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email");
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      if (data.reset_token) {
        toast.success("Reset token generated");
        navigate(`/reset-password?token=${data.reset_token}`);
      } else {
        toast("If the email exists, a reset token was generated");
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot password 🔑" subtitle="Enter your email and we'll generate a reset token">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="input input-bordered flex items-center gap-2 w-full">
            <FiMail className="opacity-50" />
            <input type="email" className="grow" placeholder="Your email" value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </label>
          {error && <p className="text-error text-sm mt-1">{error}</p>}
        </div>
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? <span className="loading loading-spinner" /> : "Get reset token"}
        </button>
        <p className="text-sm text-center">
          <Link to="/login" className="link link-primary">Back to login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}