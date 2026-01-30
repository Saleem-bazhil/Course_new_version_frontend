// src/paymentmodel/PaymentModel.jsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { XCircle, ShieldCheck } from "lucide-react";
import api from "../Api";
import { useNavigate } from "react-router-dom";

const PaymentModal = ({ guide, itemType = "Pdf", onClose }) => {
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

      // 1️⃣ Create order (REUSABLE)
      const { data } = await api.post(
        "/payment/order",
        {
          itemId: guide._id,
          itemType, // Pdf | Course
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!data?.success) {
        alert("Order creation failed");
        return;
      }

      const order = data.data.order;

      // Log the backend order response so we can debug mismatches
      console.log("[Payment] created order:", { order, rawResponse: data });

      // Normalize amount -> Razorpay expects integer amount in paise
      let amountToUse = Number(order?.amount ?? order?.amount_in_paisa ?? 0);
      if (isNaN(amountToUse) || amountToUse <= 0) {
        // Fallback to guide.price if backend didn't return a valid amount
        amountToUse = Math.round((guide.price || 0) * 100);
      } else if (amountToUse < 1000) {
        // If value looks like rupees (small number), convert to paise
        amountToUse = Math.round(amountToUse * 100);
      }

      // Order id may be under different keys depending on backend
      const orderId =
        order?.id || order?.order_id || order?.razorpay_order_id || order?._id;

      console.log("[Payment] normalized:", { amountToUse, orderId });

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amountToUse,
        currency: order.currency,
        name: "Skiez Pdf Books",
        description: guide.title,
        order_id: orderId,

        handler: async (response) => {
          try {
            const verify = await api.post(
              "/payment/paymentVerification",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                itemId: guide._id,
                itemType, // Pdf | Course
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (!verify.data.success) {
              alert("Payment verification failed");
              return;
            }

            onClose();

            // 🔀 Redirect based on item type
            if (itemType === "Course") {
              navigate(`/courses/${guide._id}`);
            } else {
              navigate(`/viewer/${guide._id}`);
            }
          } catch {
            alert("Verification failed");
          }
        },

        theme: { color: "#7F00FF" },
      };

      try {
        console.log("[Payment] opening Razorpay", options);
        new window.Razorpay(options).open();
      } catch (openErr) {
        console.error("[Payment] Razorpay open error:", openErr);
        alert("Unable to open Razorpay checkout. See console for details.");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || err.message || "Payment failed";
      alert(errorMessage);
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
        <h2 className="text-2xl font-bold text-white mb-1">{guide.title}</h2>
        <p className="text-grey mb-6">{guide.subject} • Lifetime Access</p>

        {/*  Price Card */}
        <div className="bg-card border border-border rounded-xl py-5 mb-6">
          <h3 className="text-4xl font-bold text-violet-600">₹{guide.price}</h3>
          <p className="text-grey text-sm">One-time payment</p>
        </div>

        {/*  Pay Button */}
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

        {/* Secure Payment */}
        <div className="flex items-center justify-center gap-2 text-xs text-grey mt-4">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          <span>100% Secure Payment with Razorpay</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;
