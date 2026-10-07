import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiLogOut, FiShield, FiGrid, FiTag } from "react-icons/fi";
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

  const link = ({ isActive }) => `btn btn-sm ${isActive ? "btn-primary" : "btn-ghost"}`;

  return (
    <header className="sticky top-0 z-30 bg-base-100/80 backdrop-blur border-b border-base-300">
      <div className="max-w-6xl mx-auto navbar px-4">
        <div className="flex-1">
          <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2 text-xl font-extrabold">
            <span className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white"><FiShield /></span>
            CityCare
          </Link>
        </div>
        <nav className="flex items-center gap-1">
          <NavLink end to={isAdmin ? "/admin" : "/dashboard"} className={link}><FiGrid /> <span className="hidden sm:inline">Dashboard</span></NavLink>
          {isAdmin && <NavLink to="/admin/categories" className={link}><FiTag /> <span className="hidden sm:inline">Categories</span></NavLink>}
          <div className="dropdown dropdown-end ml-2">
            <div tabIndex={0} role="button" className="avatar avatar-placeholder cursor-pointer">
              <div className="bg-primary text-primary-content w-9 rounded-full">
                <span>{user?.name?.[0]?.toUpperCase()}</span>
              </div>
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box shadow-lg w-56 p-2 mt-2 border border-base-300">
              <li className="px-3 py-2">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs opacity-60">{user?.email}</p>
                <span className="badge badge-primary badge-sm mt-1">{user?.role}</span>
              </li>
              <li><button onClick={handleLogout} className="text-error"><FiLogOut /> Logout</button></li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}