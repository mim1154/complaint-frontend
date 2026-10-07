import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Navbar />
      <main className="flex-1 p-4 max-w-6xl w-full mx-auto">{children}</main>
      <Footer />
    </div>
  );
}