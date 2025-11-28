import Navbar from "./components/layout/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Domains from "./pages/Domains";
import Programs from "./pages/Programs";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  const location = useLocation();

  // Pages where padding should not apply
  const noPaddingPages = ["/login", "/signup"];

  return (
    <div className="min-h-screen bg-white text-csDark">
      <Navbar />

      <div className={noPaddingPages.includes(location.pathname) ? "" : "pt-24 px-6"}>
        <Routes>
          {/* HOME PAGE */}
          <Route path="/" element={<Home />} />

          {/* OTHER PAGES */}
          <Route path="/domains" element={<Domains />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />

          {/* AUTH PAGES */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}
