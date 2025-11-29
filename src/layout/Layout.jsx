import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image with Overlay */}
      {/* Background Image */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/home-bg.jpg)`, // 👈 Use backticks, remove quotes
        }}
      />

      {/* Content Wrapper */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />

        {/* Page Content */}
        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}