import Navbar from "./components/layout/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";

import Hero from "./components/home/Hero";



import Home from "./pages/Home";
import Domains from "./pages/Domains";
import Programs from "./pages/Programs";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";


import CareerTracks from "./components/home/CareerTracks";
import ProgramSlider from "./components/home/ProgramSlider";
import StudentReview from "./components/home/StudentReview";
import WhyChooseUs from "./components/home/WhyChooseUs";



export default function App() {
  const location = useLocation();

  // Paths where padding should be removed
  const noPaddingPages = ["/login", "/signup"];

  return (
    <div className="min-h-screen bg-white text-csDark">
      <Navbar />
      

      {/* Hero only on home */}
      {location.pathname === "/" && <Hero />}

      {/* Apply padding only if NOT login/signup */}
      <div className={noPaddingPages.includes(location.pathname) ? "" : "pt-24 px-6"}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/domains" element={<Domains />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />

          {/* LOGIN & SIGNUP ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>

      </div>
      <CareerTracks />
      <ProgramSlider />
      <StudentReview />
      <WhyChooseUs />
    </div>
  );
}
