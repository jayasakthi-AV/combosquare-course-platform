import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, Lock, CheckCircle, ChevronRight, Shield, Zap, Star,
  ArrowLeft, Wallet, Smartphone, Building2, AlertCircle, Loader2,
} from "lucide-react";
import { programData } from "../data/programData";
import { isLoggedIn, enrollInProgram } from "../services/api";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "upi",  label: "UPI",                icon: Smartphone },
  { id: "netbanking", label: "Net Banking",   icon: Building2 },
  { id: "wallet", label: "Wallets",         icon: Wallet },
];

const UPI_APPS  = ["GPay", "PhonePe", "Paytm", "BHIM"];
const BANKS     = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Bank"];
const WALLETS   = ["Paytm Wallet", "Amazon Pay", "Mobikwik", "Freecharge"];

function formatCardNumber(value) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(value) {
  const d = value.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? d.slice(0,2) + "/" + d.slice(2) : d;
}

export default function Payment() {
  const { programId } = useParams();
  const navigate      = useNavigate();
  const location      = useLocation();
  const program       = programData[programId];

  const [method, setMethod]   = useState("card");
  const [step,   setStep]     = useState("form"); // form | processing | success
  const [error,  setError]    = useState("");

  // Card
  const [cardNumber, setCardNumber] = useState("");
  const [cardName,   setCardName]   = useState("");
  const [expiry,     setExpiry]     = useState("");
  const [cvv,        setCvv]        = useState("");
  const [saveCard,   setSaveCard]   = useState(false);

  // UPI
  const [upiId,          setUpiId]          = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState("");

  // Net banking / Wallet
  const [selectedBank,   setSelectedBank]   = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");

  const price = location.state?.price || 12999;
  const gst   = Math.round(price * 0.18);
  const total = price + gst;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isLoggedIn()) navigate("/login");
    if (!program)      navigate("/programs");
  }, [programId]);

  const handlePay = async () => {
    setError("");
    if (method === "card") {
      if (cardNumber.replace(/\s/g, "").length < 16) return setError("Enter a valid 16-digit card number.");
      if (!cardName.trim())                              return setError("Enter the cardholder name.");
      if (expiry.length < 5)                             return setError("Enter a valid expiry date.");
      if (cvv.length < 3)                                return setError("Enter a valid CVV.");
    }
    if (method === "upi"        && !upiId && !selectedUpiApp) return setError("Choose a UPI app or enter your UPI ID.");
    if (method === "netbanking" && !selectedBank)            return setError("Please select a bank.");
    if (method === "wallet"     && !selectedWallet)          return setError("Please select a wallet.");

    setStep("processing");
    try {
      await new Promise(r => setTimeout(r, 2200));
      const res  = await fetch(`http://localhost:8001/api/programs/${programId}`);
      const prog = await res.json();
      await enrollInProgram(prog.id);
      setStep("success");
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err) {
      setStep("form");
      setError(err.response?.data?.detail || "Payment failed. Please try again.");
    }
  };

  if (!program) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pt-28 pb-16 px-4">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(`/program/${programId}`)}
          className="flex items-center gap-2 text-purple-300 hover:text-white transition mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Program
        </motion.button>

        <AnimatePresence mode="wait">

          {step === "processing" && (
            <motion.div key="processing" initial={{ opacity:0,scale:0.95 }} animate={{ opacity:1,scale:1 }} exit={{ opacity:0,scale:0.95 }}
              className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/30">
                <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Processing Payment</h2>
              <p className="text-purple-300">Please do not close this window…</p>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div key="success" initial={{ opacity:0,scale:0.9 }} animate={{ opacity:1,scale:1 }}
              className="flex flex-col items-center justify-center py-28 text-center">
              <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring",stiffness:200,delay:0.1 }}
                className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 border-2 border-green-400">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </motion.div>
              <h2 className="text-3xl font-extrabold text-white mb-3">Payment Successful! 🎉</h2>
              <p className="text-green-300 text-lg mb-2">You're enrolled in <span className="font-bold">{program.title}</span></p>
              <p className="text-purple-300 text-sm">Redirecting to your dashboard…</p>
            </motion.div>
          )}

          {step === "form" && (
            <motion.div key="form" initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}
              className="grid lg:grid-cols-[1fr_380px] gap-8">

              <!-- LEFT -->
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-white mb-1">Complete Your Purchase</h1>
                  <p className="text-purple-300 text-sm">Secure payment powered by industry-grade encryption</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => { setMethod(id); setError(""); }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-sm font-semibold transition-all duration-200 ${
                        method === id
                          ? "bg-purple-600/30 border-purple-400 text-white shadow-lg shadow-purple-900/40"
                          : "bg-white/5 border-white/10 text-purple-300 hover:bg-white/10 hover:border-white/20"
                      }`}>
                      <Icon className="w-5 h-5" />{label}
                    </button>
                  ))}
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                  <AnimatePresence mode="wait">

                    {method === "card" && (
                      <motion.div key="card" initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-10 }} className="space-y-5">
                        <h3 className="text-white font-bold text-lg flex items-center gap-2"><CreditCard className="w-5 h-5 text-purple-400" /> Card Details</h3>
                        <div>
                          <label className="block text-purple-300 text-sm font-medium mb-2">Card Number</label>
                          <input type="text" placeholder="1234 5678 9012 3456" value={cardNumber}
                            onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 transition text-base tracking-widest" />
                        </div>
                        <div>
                          <label className="block text-purple-300 text-sm font-medium mb-2">Cardholder Name</label>
                          <input type="text" placeholder="Name on card" value={cardName}
                            onChange={e => setCardName(e.target.value)}
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 transition" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-purple-300 text-sm font-medium mb-2">Expiry</label>
                            <input type="text" placeholder="MM/YY" value={expiry}
                              onChange={e => setExpiry(formatExpiry(e.target.value))}
                              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 transition" />
                          </div>
                          <div>
                            <label className="block text-purple-300 text-sm font-medium mb-2">CVV</label>
                            <input type="password" placeholder="•••" maxLength={4} value={cvv}
                              onChange={e => setCvv(e.target.value.replace(/\D/g, ""))}
                              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 transition" />
                          </div>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div onClick={() => setSaveCard(!saveCard)}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${saveCard ? "bg-purple-500 border-purple-500" : "border-white/30"}`}>
                            {saveCard && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-purple-300 text-sm group-hover:text-white transition">Save card for future payments</span>
                        </label>
                      </motion.div>
                    )}

                    {method === "upi" && (
                      <motion.div key="upi" initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-10 }} className="space-y-5">
                        <h3 className="text-white font-bold text-lg flex items-center gap-2"><Smartphone className="w-5 h-5 text-purple-400" /> Pay via UPI</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {UPI_APPS.map(app => (
                            <button key={app} onClick={() => { setSelectedUpiApp(app); setUpiId(""); }}
                              className={`py-3 px-4 rounded-xl border text-sm font-semibold transition ${selectedUpiApp === app ? "bg-purple-600/30 border-purple-400 text-white" : "bg-white/5 border-white/10 text-purple-300 hover:bg-white/10"}`}>
                              {app}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-px bg-white/10" /><span className="text-purple-400 text-xs">OR enter UPI ID</span><div className="flex-1 h-px bg-white/10" />
                        </div>
                        <input type="text" placeholder="yourname@upi" value={upiId}
                          onChange={e => { setUpiId(e.target.value); setSelectedUpiApp(""); }}
                          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 transition" />
                      </motion.div>
                    )}

                    {method === "netbanking" && (
                      <motion.div key="netbanking" initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-10 }} className="space-y-5">
                        <h3 className="text-white font-bold text-lg flex items-center gap-2"><Building2 className="w-5 h-5 text-purple-400" /> Net Banking</h3>
                        <div className="space-y-2">
                          {BANKS.map(bank => (
                            <button key={bank} onClick={() => setSelectedBank(bank)}
                              className={`w-full flex items-center justify-between py-3 px-5 rounded-xl border text-sm font-medium transition ${selectedBank === bank ? "bg-purple-600/30 border-purple-400 text-white" : "bg-white/5 border-white/10 text-purple-300 hover:bg-white/10"}`}>
                              {bank}{selectedBank === bank && <CheckCircle className="w-4 h-4 text-purple-400" />}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {method === "wallet" && (
                      <motion.div key="wallet" initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-10 }} className="space-y-5">
                        <h3 className="text-white font-bold text-lg flex items-center gap-2"><Wallet className="w-5 h-5 text-purple-400" /> Choose Wallet</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {WALLETS.map(w => (
                            <button key={w} onClick={() => setSelectedWallet(w)}
                              className={`py-3 px-4 rounded-xl border text-sm font-semibold transition ${selectedWallet === w ? "bg-purple-600/30 border-purple-400 text-white" : "bg-white/5 border-white/10 text-purple-300 hover:bg-white/10"}`}>
                              {w}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>

                  {error && (
                    <motion.div initial={{ opacity:0,y:-6 }} animate={{ opacity:1,y:0 }}
                      className="mt-5 flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />{error}
                    </motion.div>
                  )}

                  <motion.button whileHover={{ scale:1.02,y:-2 }} whileTap={{ scale:0.98 }} onClick={handlePay}
                    className="mt-7 w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-purple-900/50 transition">
                    <Lock className="w-5 h-5" /> Pay ₹{total.toLocaleString("en-IN")} <ChevronRight className="w-5 h-5" />
                  </motion.button>

                  <div className="mt-5 flex items-center justify-center gap-6 text-xs text-purple-400">
                    <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> SSL Secured</span>
                    <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Instant Access</span>
                    <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> 256-bit Encrypted</span>
                  </div>
                </div>
              </div>

              <!-- RIGHT — Order Summary -->
              <div className="space-y-5">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sticky top-28">
                  <h3 className="text-white font-bold text-lg mb-5">Order Summary</h3>
                  <div className="flex gap-4 mb-6 pb-6 border-b border-white/10">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-purple-900/40 shrink-0">
                      <img src={program.heroImg} alt={program.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm leading-snug">{program.title}</p>
                      <p className="text-purple-400 text-xs mt-1">{program.subtitle}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {program.highlights?.slice(0,4).map((h,i) => (
                      <li key={i} className="flex items-center gap-2 text-purple-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />{h}
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-3 pt-5 border-t border-white/10 text-sm">
                    <div className="flex justify-between text-purple-300"><span>Program Fee</span><span>₹{price.toLocaleString("en-IN")}</span></div>
                    <div className="flex justify-between text-purple-300"><span>GST (18%)</span><span>₹{gst.toLocaleString("en-IN")}</span></div>
                    <div className="flex justify-between text-white font-bold text-base pt-3 border-t border-white/10">
                      <span>Total</span><span className="text-purple-300">₹{total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-sm text-purple-300 bg-white/5 rounded-xl px-4 py-3">
                    <div className="flex gap-0.5">{[...Array(5)].map((_,i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}</div>
                    <span>4.9 · 1,200+ students enrolled</span>
                  </div>
                  <p className="mt-4 text-center text-purple-400 text-xs">🔒 Your payment is 100% safe & secure</p>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}