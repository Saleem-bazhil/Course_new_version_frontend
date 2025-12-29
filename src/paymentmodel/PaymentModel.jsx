// src/paymentmodel/PaymentModel.jsx
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { XCircle, ShieldCheck } from "lucide-react";
import api from "../Api";
import { useNavigate } from "react-router-dom";

const PaymentModal = ({ guide, onClose }) => {
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      if (!guide) {
        alert("Guide details are missing. Please try again.");
        return;
      }

      const guideId = guide._id || guide.id;
      if (!guideId) {
        console.error("❌ guideId is missing:", guide);
        alert("Invalid guide. Please go back and try again.");
        return;
      }

      console.log("🔹 Starting payment for:", guide.title, "→", guideId);

      // 1️⃣ Get auth token
      const rawUser = localStorage.getItem("user");
      const user = rawUser ? JSON.parse(rawUser) : null;
      const token = user?.token || localStorage.getItem("token");

      if (!token) {
        alert("Please login to continue payment.");
        navigate("/login");
        return;
      }

      // 2️⃣ Create Razorpay order
      const { data } = await api.post(
        "/payment/order",
        {
          amount: guide.price || 49,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Order created from backend:", data);

      if (!data?.success || !data?.data?.order) {
        alert("Invalid order response from server.");
        return;
      }

      const order = data.data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Skiez Pdf Books",
        description: `Purchase of ${guide.title}`,
        order_id: order.id,

        handler: async function (response) {
          try {
            console.log("💰 Razorpay success:", response);

            // 3️⃣ Verify payment
            const verifyRes = await api.post(
              "/payment/paymentVerification",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                guideId,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!verifyRes.data.success) {
              alert("Payment verification failed on server.");
              return;
            }

            // 4️⃣ Mark as paid locally (NO backend purchase API)
            try {
              const userId = user?._id || user?.id;
              if (userId) {
                localStorage.setItem(`paid_${userId}_${guideId}`, "true");
              }
            } catch (e) {
              console.warn("⚠️ Could not save paid flag:", e);
            }

            alert("✅ Payment Successful! Guide unlocked.");
            onClose();
            navigate(`/viewer/${guideId}`);
          } catch (err) {
            console.error("Error after payment:", err);
            alert(
              "Something went wrong after payment. Please contact support."
            );
          }
        },

        prefill: {
          name: user?.name || "your name",
          email: user?.email || "yourname@gmail.com",
        },

        theme: {
          color: "#4f46e5",
        },
      };

      const razor = new window.Razorpay(options);

      razor.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert("Payment Failed: " + response.error.description);
      });

      razor.open();
    } catch (error) {
      console.error(
        "Razorpay Error:",
        error.response?.data || error.message || error
      );
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Payment Failed. Please try again."
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 40 }}
        transition={{ duration: 0.4 }}
        className="
          relative bg-white/90 backdrop-blur-xl 
          rounded-2xl shadow-xl border border-blue-100 
          w-[90%] sm:w-[400px] p-8 text-center
        "
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <XCircle className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {guide.title}
        </h2>

        <p className="text-gray-500 mb-6">
          {guide.subject} • Lifetime Access
        </p>

        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 rounded-xl py-5 mb-6">
          <h3 className="text-4xl font-bold text-blue-600">
            ₹{guide.price}
          </h3>
          <p className="text-gray-500 text-sm">One-time payment</p>
        </div>

        <Button
          onClick={handlePayment}
          className="
            w-full py-3 rounded-xl text-lg font-semibold 
            bg-gradient-to-r from-blue-500 to-indigo-600 
            hover:brightness-110 text-white transition-all
          "
        >
          Pay Now
        </Button>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          <span>100% Secure Payment with Razorpay</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;
