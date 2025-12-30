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
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 mt-16 sm:mt-20">
        <Link
          to="/"
          className="mb-4 inline-flex text-sm text-white hover:underline"
        >
          ← Back to guides
        </Link>

        <div className="grid gap-8 lg:gap-10 lg:grid-cols-2">
          {/* LEFT IMAGE SECTION */}
          <div className="max-w-md mx-auto lg:mx-0 w-full">
            <div className="border rounded-2xl bg-card p-3 sm:p-4 shadow-sm">
              <img
                src={activeImage}
                alt={guide.title}
                className=" w-full max-h-[360px] sm:max-h-[430px] object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1 justify-center lg:justify-start">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`border rounded-xl p-1 min-w-[4.2rem] sm:min-w-[5rem] ${
                      idx === activeIndex
                        ? "border-border border-purple-500"
                        : "border-border"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Preview ${idx + 1}`}
                      className="h-14 sm:h-16 w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT INFO SECTION */}
          <div className="space-y-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
              {guide.title}
            </h1>

            <p className="text-sm text-grey">
              Subject:{" "}
              <span className="font-semibold capitalize">
                {guide.subject || guide.category}
              </span>
            </p>

            <p className="text-emerald-600 font-medium text-sm sm:text-base">
              In stock – Instant PDF access
            </p>

            <div className="flex flex-col items-center lg:items-start gap-1">
              <span className="text-sm text-white">Price</span>
              <span className="text-2xl sm:text-3xl font-bold text-white">
                ₹{guide.price || 49}
              </span>
            </div>

            <div className="space-y-3 w-full max-w-sm">
              {!userPurchased && (
                <Button
                  onClick={() => setShowPayment(true)}
                  variant="purple"
                >
                  Buy Now
                </Button>
              )}

              {userPurchased && (
                <Button
                  variant="purple"
                  onClick={() => navigate(`/viewer/${id}`)}
                  className="
                    w-full py-3 rounded-full border-blue-300 
                    text-white hover:bg-blue-50 hover:scale-none hover:shadow-none
                    font-semibold flex items-center justify-center gap-2
                  "
                >
                  <span className="text-white text-lg">🔓</span>
                  View Guide
                </Button>
              )}
            </div>

            <p className="text-sm text-white pt-4 border-t border-border leading-relaxed">
              {guide.description}
            </p>

            <p className="text-xs text-white">
              Note: This is a protected PDF. View online only – no downloads, no
              expiry.
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
