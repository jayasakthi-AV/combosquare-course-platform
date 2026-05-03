import Navbar from "./components/layout/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import PaymentPage   from "./pages/PaymentPage";
import CoursePlayer  from "./pages/CoursePlayer";


import Home from "./pages/Home";
import Programs from "./pages/Programs";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DomainPage from "./pages/DomainPage";
import ProgramPage from "./pages/ProgramPage";
import CareerPage from "./pages/CareerPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import LearnPage from "./pages/LearnPage";

import ProgramDetail from "./pages/ProgramDetail";
import AuthCallback from "./pages/AuthCallback";

export default function App() {
  const location = useLocation();
const noPaddingPages = ['/login', '/register', '/auth/callback'];
  return (
    <div className="min-h-screen bg-[#fcfcfd] text-gray-900 flex flex-col w-full overflow-hidden">
      <Navbar />
      <div className={noPaddingPages.some(p => location.pathname.startsWith(p)) ? "" : "pt-24 px-6"}>
      <Routes>
  <Route path="/"                element={<Home />} />
  <Route path="/domains/:domainId" element={<DomainPage />} />
  <Route path="/program/:programId" element={<ProgramPage />} />
  <Route path="/programs"        element={<Programs />} />
  <Route path="/programs/:slug"  element={<ProgramDetail />} />
  <Route path="/careers"         element={<Careers />} />
  <Route path="/careers/:careerId" element={<CareerPage />} />
  <Route path="/contact"         element={<Contact />} />
  <Route path="/login"           element={<Login />} />
  <Route path="/signup"          element={<Signup />} />

  {/* Protected */}
  <Route path="/pay/:slug"       element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
  <Route path="/learn/:slug"     element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />

  <Route path="/dashboard"       element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
  <Route path="/admin"           element={<AdminRoute><AdminDashboard /></AdminRoute>} />
  <Route path="/auth/callback" element={<AuthCallback />} />
</Routes>
      </div>
    </div>
  );
}