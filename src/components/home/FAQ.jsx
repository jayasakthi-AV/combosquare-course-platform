import React, { useState } from "react";
import {
  Smile,
  Repeat,
  FileQuestion,
  Users,
  Infinity,
  CreditCard,
  Mail,
  Headphones,
  Play,
  Briefcase,
} from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    id: 1,
    icon: <Smile className="w-6 h-6 text-purple-600" />,
    question: "Is there a free trial available?",
    answer:
      "Yes! You can try any course for free. We also offer demo sessions so you can experience the platform before enrolling.",
  },
  {
    id: 2,
    icon: <Repeat className="w-6 h-6 text-purple-600" />,
    question: "Can I change my plan later?",
    answer:
      "Absolutely — you can upgrade or switch plans anytime. Our team can help you choose the right option based on your learning path.",
  },
  {
    id: 3,
    icon: <FileQuestion className="w-6 h-6 text-purple-600" />,
    question: "What is your cancellation policy?",
    answer:
      "You can cancel at any time. If you're within the refund window, we will process your refund immediately.",
  },
  {
    id: 4,
    icon: <Users className="w-6 h-6 text-purple-600" />,
    question: "Can other information be added to an invoice?",
    answer:
      "Yes, you can request to add GST, organization name, business details, or address to your invoice.",
  },
  {
    id: 5,
    icon: <Infinity className="w-6 h-6 text-purple-600" />,
    question: "What does lifetime access mean?",
    answer:
      "Once enrolled, you will get lifetime access to all course materials, updates, notes, and future improvements.",
  },
  {
    id: 6,
    icon: <CreditCard className="w-6 h-6 text-purple-600" />,
    question: "How does billing work?",
    answer:
      "Billing is per student account. You can pay monthly or yearly. You can upgrade anytime.",
  },
  {
    id: 7,
    icon: <Mail className="w-6 h-6 text-purple-600" />,
    question: "How do I change my account email?",
    answer:
      "Go to your account settings and update your email. A verification link will be sent to your new address.",
  },
  {
    id: 8,
    icon: <Headphones className="w-6 h-6 text-purple-600" />,
    question: "How does support work?",
    answer:
      "We provide 24/7 support through chat, email, and call. Our team is always ready to help.",
  },
  {
    id: 9,
    icon: <Play className="w-6 h-6 text-purple-600" />,
    question: "Do you provide tutorials?",
    answer:
      "Yes! We offer live classes, tutorials, recorded videos, and step-by-step walkthroughs for all modules.",
  },
  {
    id: 10,
    icon: <Briefcase className="w-6 h-6 text-purple-600" />,
    question: "Can I use this for commercial projects?",
    answer:
      "Yes, you can use your skills to build websites, apps, or commercial projects for clients.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="faq-bg w-full py-20 relative">
      <div className="relative z-10 max-w-6xl mx-auto px-6">

        <h2 className="text-1xl font-bold text-purple-600 text-center">
          Frequently asked questions
        </h2>

        <p className="text-grey-600 text-3xl mt-3 text-center font-bold mb-16">
          We’re here to help with all <span className="text-purple-600">your questions.</span>
        </p>

        {/* FAQ Items Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              onClick={() => toggleFAQ(faq.id)}
              className="bg-purple-50 border border-purple-200 rounded-xl p-5 cursor-pointer 
                         shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="p-2 rounded-lg bg-white shadow-sm border border-purple-100">
                  {faq.icon}
                </div>

                <h3 className="text-gray-900 font-semibold text-lg flex-1">
                  {faq.question}
                </h3>

                {openId === faq.id ? (
                  <ChevronUp className="text-purple-600 mt-1" />
                ) : (
                  <ChevronDown className="text-purple-600 mt-1" />
                )}
              </div>

              <div
                className={`text-gray-700 text-sm leading-relaxed transition-all duration-500 overflow-hidden ${
                  openId === faq.id
                    ? "max-h-40 mt-3 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {faq.answer}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
