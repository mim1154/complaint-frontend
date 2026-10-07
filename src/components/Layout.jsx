import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 fade-in">{children}</main>
      <Footer />
    </div>
  );
}