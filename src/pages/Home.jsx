import { Link } from "react-router-dom";
import { FiShield, FiEdit3, FiActivity, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const features = [
  { icon: FiEdit3, title: "Report instantly", text: "Describe the problem, pick a category and submit in under a minute." },
  { icon: FiActivity, title: "Track progress", text: "See your complaint move from pending to in-progress to resolved." },
  { icon: FiCheckCircle, title: "Get it resolved", text: "Admins review every request and update its status transparently." },
];

export default function Home() {
  const { user, isAdmin } = useAuth();
  const dash = isAdmin ? "/admin" : "/dashboard";

  return (
    <div className="min-h-screen bg-base-100">
      <header className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <span className="flex items-center gap-2 text-xl font-extrabold">
          <span className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white"><FiShield /></span> CityCare
        </span>
        <div className="flex gap-2">
          {user ? (
            <Link to={dash} className="btn btn-primary btn-sm">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign up</Link>
            </>
          )}
        </div>
      </header>

      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 py-24 fade-in">
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">A better city starts with your voice</h1>
          <p className="mt-5 text-lg text-white/80">Report road damage, water, electricity and more. Track every complaint until it is resolved.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to={user ? dash : "/signup"} className="btn btn-lg bg-white text-indigo-700 border-0 hover:bg-white/90">
              Get started <FiArrowRight />
            </Link>
            {!user && <Link to="/login" className="btn btn-lg btn-outline text-white border-white/60 hover:bg-white/10">Login</Link>}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold text-center">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-6 mt-10">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card bg-base-100 border border-base-300 p-6 hover:shadow-xl hover:-translate-y-1 transition">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl"><Icon /></div>
              <h3 className="font-bold text-lg mt-4">{title}</h3>
              <p className="text-base-content/60 mt-1">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-base-300 py-6 text-center text-sm text-base-content/60">
        © 2026 CityCare · City Complaint & Service Request Platform
      </footer>
    </div>
  );
}