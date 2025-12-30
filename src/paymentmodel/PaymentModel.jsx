// src/paymentmodel/PaymentModel.jsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { XCircle, ShieldCheck } from "lucide-react";
import api from "../Api";
import { useNavigate } from "react-router-dom";

const PaymentModal = ({ guide, onClose }) => {
  const navigate = useNavigate();

  if (!guide) return null; // ✅ safety guard

  const handlePayment = async () => {
    try {
      const rawUser = localStorage.getItem("user");
      const token =
        (rawUser && JSON.parse(rawUser)?.token) ||
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // 1️⃣ Create order
      const { data } = await api.post(
        "/payment/order",
        { guideId: guide._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data?.success) {
        alert("Order creation failed");
        return;
      }

      const order = data.data.order;

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Skiez Pdf Books",
        description: guide.title,
        order_id: order.id,

        handler: async (response) => {
          try {
            const verify = await api.post(
              "/payment/paymentVerification",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                guideId: guide._id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!verify.data.success) {
              alert("Payment verification failed");
              return;
            }

            onClose();
            navigate(`/viewer/${guide._id}`);
          } catch {
            alert("Verification failed");
          }
        },

        theme: { color: "#7F00FF" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
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
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="
          relative bg-card backdrop-blur-xl
          rounded-2xl shadow-2xl border border-border
          w-[90%] sm:w-[400px] p-8 text-center
        "
      >

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-grey transition"
        >
          <XCircle className="h-5 w-5" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-1">
          {guide.title}
        </h2>
        <p className="text-grey mb-6">
          {guide.subject} • Lifetime Access
        </p>

        {/* 💰 Price Card */}
        <div className="bg-card border border-border rounded-xl py-5 mb-6">
          <h3 className="text-4xl font-bold text-violet-600">
            ₹{guide.price}
          </h3>
          <p className="text-grey text-sm">
            One-time payment
          </p>
        </div>

        {/* 💳 Pay Button */}
        <Button
          onClick={handlePayment}
          className="
            w-full py-3 rounded-xl text-lg font-semibold
            bg-gradient-to-r from-violet-500 to-indigo-600
            hover:brightness-110 text-white transition-all
          "
        >
          Pay Now
        </Button>

        {/* 🔒 Secure Payment */}
        <div className="flex items-center justify-center gap-2 text-xs text-grey mt-4">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          <span>100% Secure Payment with Razorpay</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;
