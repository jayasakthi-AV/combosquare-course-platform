import Navbar from "./components/layout/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Programs from "./pages/Programs";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// ⭐ IMPORTANT: IMPORT DOMAINPAGE
import DomainPage from "./pages/DomainPage";

export default function App() {
  const location = useLocation();

  const noPaddingPages = ["/login", "/signup"];

  return (
    <div className="min-h-screen bg-white text-csDark">
      <Navbar />

      <div className={noPaddingPages.includes(location.pathname) ? "" : "pt-24 px-6"}>
        <Routes>

          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* ⭐ DYNAMIC DOMAIN PAGE */}
          <Route path="/domains/:domainId" element={<DomainPage />} />

          {/* OTHER STATIC PAGES */}
          <Route path="/programs" element={<Programs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

        </Routes>
      </div>
    </div>
  );
}
