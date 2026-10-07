import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiHome } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <Link to={isAdmin ? "/admin" : "/dashboard"} className="btn btn-ghost text-xl">
          <FiHome /> City Complaints
        </Link>
      </div>
      <div className="flex-none gap-2">
        {isAdmin && <Link to="/admin/categories" className="btn btn-ghost btn-sm">Categories</Link>}
        <span className="hidden sm:inline text-sm">{user?.name} ({user?.role})</span>
        <button onClick={handleLogout} className="btn btn-error btn-sm">
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
}