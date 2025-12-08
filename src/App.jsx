import Navbar from "./components/layout/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Programs from "./pages/Programs";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import DomainPage from "./pages/DomainPage";
import ProgramPage from "./pages/ProgramPage";
import CareerPage from "./pages/CareerPage";


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

          {/* DOMAINS */}
          <Route path="/domains/:domainId" element={<DomainPage />} />

          {/* ⭐ FIXED PROGRAM ROUTE */}
          <Route path="/program/:programId" element={<ProgramPage />} />
          <Route path="/careers/:careerId" element={<CareerPage />} />


          {/* STATIC PAGES */}
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
