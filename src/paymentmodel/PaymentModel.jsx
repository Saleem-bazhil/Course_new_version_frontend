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
    <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[380px] text-center relative">
        <button onClick={onClose} className="absolute top-3 right-3">
          <XCircle />
        </button>

        <h2 className="text-xl font-bold">{guide.title}</h2>
        <p className="text-gray-500 mt-1">Lifetime Access</p>

        <div className="my-6">
          <h3 className="text-3xl font-bold text-blue-600">
            ₹{guide.price}
          </h3>
        </div>

        <Button onClick={handlePayment} className="w-full">
          Pay Now
        </Button>

        <div className="flex justify-center gap-2 text-xs mt-3">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          Secure Razorpay Payment
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentModal;
