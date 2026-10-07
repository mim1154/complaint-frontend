import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <h1 className="text-6xl font-bold">404</h1>
      <p>Page not found</p>
      <Link to="/" className="btn btn-primary">Go home</Link>
    </div>
  );
}