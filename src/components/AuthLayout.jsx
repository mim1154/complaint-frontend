import { Link } from "react-router-dom";
import { FiShield, FiCheckCircle } from "react-icons/fi";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 text-white bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="p-2 bg-white/20 rounded-xl"><FiShield /></span> CityCare
        </Link>
        <div>
          <h2 className="text-4xl font-extrabold leading-tight">Your city, your voice.</h2>
          <p className="mt-3 text-white/80 max-w-md">Report problems, track progress and see them resolved, all in one place.</p>
          <ul className="mt-6 space-y-2 text-white/90">
            {["Submit complaints in seconds", "Track status in real time", "Get issues resolved faster"].map((t) => (
              <li key={t} className="flex items-center gap-2"><FiCheckCircle /> {t}</li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-white/60">© 2026 CityCare</p>
      </div>

      <div className="flex items-center justify-center p-6 bg-base-100">
        <div className="w-full max-w-md fade-in">
          <h1 className="text-3xl font-extrabold">{title}</h1>
          <p className="text-base-content/60 mt-1 mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}