import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

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
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <form onSubmit={submit} className="card w-full max-w-sm bg-base-100 shadow-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        <div>
          <input type="email" placeholder="Your email" className="input input-bordered w-full"
            value={email} onChange={(e) => setEmail(e.target.value)} />
          {error && <p className="text-error text-sm mt-1">{error}</p>}
        </div>
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Please wait..." : "Get reset token"}
        </button>
        <p className="text-sm text-center"><Link to="/login" className="link link-primary">Back to login</Link></p>
      </form>
    </div>
  );
}