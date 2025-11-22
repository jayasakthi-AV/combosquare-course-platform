import Navbar from "./components/layout/Navbar";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Domains from "./pages/Domains";
import Programs from "./pages/Programs";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-csDark">
      <Navbar />

      <div className="pt-24 px-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </div>
  );
}
