// (imports same as yours)
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
  { id: "upi",  label: "UPI", icon: Smartphone },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
  { id: "wallet", label: "Wallets", icon: Wallet },
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
  const navigate = useNavigate();
  const location = useLocation();
  const program  = programData[programId];

  const [method, setMethod] = useState("card");
  const [step, setStep] = useState("form");
  const [error, setError] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  const [upiId, setUpiId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState("");

  const [selectedBank, setSelectedBank] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");

  const price = location.state?.price || 12999;
  const gst = Math.round(price * 0.18);
  const total = price + gst;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isLoggedIn()) navigate("/login");
    if (!program) navigate("/programs");
  }, [programId]);

  const handlePay = async () => {
    setError("");

    if (method === "card") {
      if (cardNumber.replace(/\s/g, "").length < 16) return setError("Enter valid card number");
      if (!cardName.trim()) return setError("Enter name");
      if (expiry.length < 5) return setError("Enter expiry");
      if (cvv.length < 3) return setError("Enter CVV");
    }

    setStep("processing");

    try {
      await new Promise(r => setTimeout(r, 2000));
      await enrollInProgram(programId);
      setStep("success");
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch {
      setStep("form");
      setError("Payment failed");
    }
  };

  if (!program) return null;

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        <AnimatePresence mode="wait">

          {step === "processing" && (
            <div className="text-center py-20">
              <Loader2 className="animate-spin mx-auto mb-4" />
              Processing Payment...
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-20">
              <CheckCircle className="mx-auto mb-4 text-green-500" />
              Payment Successful!
            </div>
          )}

          {step === "form" && (
            <div className="grid lg:grid-cols-[1fr_380px] gap-8">

              {/* LEFT */}
              <div>
                <h1 className="text-2xl mb-4">Payment</h1>

                <input
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                />

                <input
                  placeholder="Name"
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                />

                <input
                  placeholder="Expiry"
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                />

                <input
                  placeholder="CVV"
                  value={cvv}
                  onChange={e => setCvv(e.target.value)}
                />

                <button onClick={handlePay}>
                  Pay ₹{total}
                </button>

                {error && <p>{error}</p>}
              </div>

              {/* RIGHT — Order Summary */}
              <div>
                <h3>Order Summary</h3>
                <p>{program.title}</p>
                <p>Total: ₹{total}</p>
              </div>

            </div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}