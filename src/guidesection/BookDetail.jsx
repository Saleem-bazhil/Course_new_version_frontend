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
  // State
  // -------------------------
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // -------------------------
  // Fetch guide by ID
  // -------------------------
 const fetchGuide = async () => {
  if (!guideId) return;

  try {
    setLoading(true);
    const res = await api.get(`/pdf/${guideId}`);
    setGuide(res.data.data);
    setActiveIndex(0);
  } catch (err) {
    console.error("Error fetching guide:", err);
    setGuide(null);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchGuide();
}, [guideId]);


  // -------------------------
  // Loading
  // -------------------------
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 mt-16 text-center">
        <p className="text-lg font-semibold">Loading guide details...</p>
      </div>
    );
  }

  // -------------------------
  // No guide
  // -------------------------
  if (!guide) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 mt-16">
        <p className="text-lg font-semibold mb-2 text-center">
          Guide details not found.
        </p>
        <div className="flex justify-center">
          <Link to="/" className="text-sm text-blue-600 hover:underline">
            ← Back to guides
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------
  // Current user & local paid flag
  // -------------------------
  let currentUserId = null;
  try {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      currentUserId = parsed._id || parsed.id;
    }
  } catch {}

  const localPaidKey =
    currentUserId && (guide._id || guide.id)
      ? `paid_${currentUserId}_${guide._id || guide.id}`
      : null;

  const hasLocalPaidFlag = localPaidKey
    ? localStorage.getItem(localPaidKey) === "true"
    : false;

  // If backend later adds purchasedBy, we still respect it; otherwise rely on local flag
  const userPurchased =
    hasLocalPaidFlag ||
    (currentUserId && Array.isArray(guide?.purchasedBy)
      ? guide.purchasedBy.includes(currentUserId)
      : false);

  // -------------------------
  // Images (BACKEND)
  // -------------------------
  const images = guide?.image_detail
    ? Object.values(guide.image_detail).filter(Boolean)
    : [DEFAULT_BOOK_IMAGE];

  const activeImage = images[activeIndex] || images[0];
  const id = guide._id || guide.id;

  // -------------------------
  // UI (STYLE FROM FIRST CODE)
  // -------------------------
return (
  <div className="bg-background min-h-screen">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 mt-16 sm:mt-20">
      <Link
        to="/"
        className="mb-10 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
      >
        ← Back to guides
      </Link>

      <div className="grid gap-10 sm:gap-12 lg:gap-14 lg:grid-cols-2 items-start">
        {/* LEFT */}
        <div className="flex flex-col items-center lg:items-start">
          <div className="w-full max-w-md">
            <div className="rounded-3xl bg-card shadow-[0_25px_70px_rgba(0,0,0,0.6)]">
  <div className="h-[300px] sm:h-[380px] md:h-[440px] lg:h-[480px] flex items-center justify-center p-4 sm:p-6">
    <img
      src={activeImage}
      alt={guide.title}
      className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-[1.03]"
    />
  </div>
</div>

          </div>

          {images.length > 1 && (
  <div className="mt-6 flex gap-3  pb-2 justify-start w-full max-w-md px-1">
    {images.map((img, idx) => (
      <button
        key={idx}
        onClick={() => setActiveIndex(idx)}
        className={`
          flex items-center justify-center
          min-w-[68px] h-[68px] sm:min-w-[88px] sm:h-[88px]
          rounded-2xl
          bg-card
          transition-all
          ${
            idx === activeIndex
              ? "ring-2 ring-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              : "opacity-70 hover:opacity-100"
          }
        `}
      >
        <img
          src={img}
          alt={`Preview ${idx + 1}`}
          className="max-h-[48px] max-w-[48px] sm:max-h-[64px] sm:max-w-[64px] object-contain"
        />
      </button>
    ))}
  </div>
)}

        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-xl mx-auto lg:mx-0 space-y-5 sm:space-y-7">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {guide.title}
          </h1>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400">
              Instant PDF access
            </span>
          </div>

          <div className="flex flex-col items-center lg:items-start gap-1">
            <span className="text-sm text-gray-400 tracking-wide">
              One-time price
            </span>
            <span className="text-4xl font-extrabold text-white">
              ₹{guide.price || 49}
            </span>
          </div>

          <div className="w-full max-w-sm space-y-4 pt-2">
            {!userPurchased && (
              <Button
                onClick={() => setShowPayment(true)}
                variant="purple"
                className="w-full py-6 rounded-2xl font-semibold text-lg transition-all hover:scale-[1.03] hover:shadow-[0_12px_30px_rgba(168,85,247,0.35)]"
              >
                Buy Now
              </Button>
            )}

            {userPurchased && (
              <Button
                variant="purple"
                onClick={() => navigate(`/viewer/${id}`)}
                className="w-full py-6 rounded-2xl font-semibold text-lg transition-all hover:scale-[1.03] hover:shadow-[0_12px_30px_rgba(168,85,247,0.35)] flex items-center justify-center gap-2"
              >
                🔓 View Guide
              </Button>
            )}
          </div>

          <div className="pt-8 border-t border-border w-full">
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              {guide.description}
            </p>
          </div>

          <p className="text-xs text-gray-400">
            Protected PDF • View online only • No downloads • Lifetime access
          </p>
        </div>
      </div>
    </div>

    {showPayment && (
      <PaymentModal guide={guide} onClose={() => setShowPayment(false)} />
    )}
  </div>
);

}
