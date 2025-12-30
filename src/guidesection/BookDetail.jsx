import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PaymentModal from "../paymentmodel/PaymentModel";
import api from "../Api";

const DEFAULT_BOOK_IMAGE =
  "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=800&q=80";

export default function BookDetail() {
  const { guideId } = useParams();
  const navigate = useNavigate();

  // -------------------------
  // STATE (LOGIC UNCHANGED)
  // -------------------------
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userPurchased, setUserPurchased] = useState(false);

  // -------------------------
  // FETCH GUIDE
  // -------------------------
  const fetchGuide = async () => {
    try {
      const res = await api.get(`/pdf/${guideId}`);
      setGuide(res.data.data);
      setActiveIndex(0);
    } catch {
      setGuide(null);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // CHECK PURCHASE
  // -------------------------
  const checkPurchase = async () => {
    try {
      const rawUser = localStorage.getItem("user");
      const token =
        (rawUser && JSON.parse(rawUser)?.token) ||
        localStorage.getItem("token");

      if (!token) return setUserPurchased(false);

      const res = await api.get("/payment/my-purchases", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const purchased = res.data?.data?.guides || [];
      setUserPurchased(purchased.some((g) => g._id === guideId));
    } catch {
      setUserPurchased(false);
    }
  };

  useEffect(() => {
    fetchGuide();
    checkPurchase();
  }, [guideId]);

  // -------------------------
  // LOADING
  // -------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading guide details...
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <p className="mb-3">Guide not found</p>
        <Link to="/" className="text-purple-400 hover:underline">
          ← Back to guides
        </Link>
      </div>
    );
  }

  // -------------------------
  // IMAGES
  // -------------------------
  const images = guide?.image_detail
    ? Object.values(guide.image_detail).filter(Boolean)
    : [DEFAULT_BOOK_IMAGE];

  const activeImage = images[activeIndex];
  const id = guide._id || guide.id;

  // -------------------------
  // UI (NEAT & CLEAN)
  // -------------------------
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        <Link
          to="/"
          className="text-sm text-gray-400 hover:text-white"
        >
          ← Back to guides
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mt-10">
          {/* LEFT : IMAGE */}
<div className="flex flex-col items-center lg:items-start gap-4">
  {/* MAIN IMAGE CARD */}
  <div className="bg-neutral-900 rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-lg">
    <img
      src={activeImage}
      alt={guide.title}
      className="w-full h-[360px] sm:h-[420px] object-contain"
    />
  </div>

{images.length > 1 && (
  <div className="w-full max-w-md">
    <div className="grid grid-cols-4 gap-3">
      {images.map((img, i) => (
        <button
          key={i}
          onClick={() => setActiveIndex(i)}
          className={`
            bg-neutral-900 rounded-xl p-2 border transition-all
            ${
              i === activeIndex
                ? "border-purple-500 ring-1 ring-purple-500/40"
                : "border-neutral-800 hover:border-neutral-600"
            }
          `}
        >
          <img
            src={img}
            alt={`Preview ${i + 1}`}
            className="w-full h-16 object-contain"
          />
        </button>
      ))}
    </div>
  </div>
)}

          </div>

          {/* RIGHT : CONTENT */}
          <div className="space-y-6 max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-bold capitalize">
              {guide.title}
            </h1>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-sm text-emerald-400">
                Instant PDF access
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-400">One-time price</p>
              <p className="text-3xl sm:text-4xl font-bold mt-1">
                ₹{guide.price || 49}
              </p>
            </div>

            {!userPurchased && (
              <Button
                variant="purple"
                className="w-full py-6 rounded-xl text-base sm:text-lg hover:shadow-none hover:scale-[1.01]"
                onClick={() => setShowPayment(true)}
              >
                Buy Now
              </Button>
            )}

            {userPurchased && (
              <Button
                variant="purple"
                className="w-full py-5 rounded-xl text-base sm:text-lg"
                onClick={() => navigate(`/viewer/${id}`)}
              >
                🔓 View Guide
              </Button>
            )}

            <div className="pt-4 border-t border-neutral-800 space-y-6">
              <p className="text-gray-300 leading-relaxed">
                {guide.description}
              </p>
              <p className="text-xs text-gray-500 mt-3">
                Protected PDF • View only • No downloads • Lifetime access
              </p>
            </div>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          guide={guide}
          onClose={() => {
            setShowPayment(false);
            checkPurchase();
          }}
        />
      )}
    </div>
  );
}
