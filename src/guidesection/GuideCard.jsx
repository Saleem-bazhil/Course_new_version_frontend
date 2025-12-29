// src/components/GuideCard.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const maths =
  "https://res.cloudinary.com/dwupqb1pj/image/upload/v1765368110/2_Samacheer_Kalvi_2_gkz4kd.png";
const chemistry =
  "https://res.cloudinary.com/dwupqb1pj/image/upload/v1765368109/2_Samacheer_Kalvi_3_tm2hxe.png";
// fallback for physics (avoid ReferenceError)
const physics = maths;

const GuideCard = ({ guides }) => {
  const safeGuides = Array.isArray(guides) ? guides : [];
  const navigate = useNavigate();

  if (!safeGuides.length) {
    return (
      <div className="mt-10 text-center text-muted-foreground">
        No guides found. Try a different search.
      </div>
    );
  }

  // Current user (for paid key)
  let currentUserId = null;
  try {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      const user = JSON.parse(rawUser);
      currentUserId = user?._id || user?.id || null;
    }
  } catch (e) {
    console.warn("Failed to parse user from localStorage");
  }

  return (
    <div
      className="
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
        gap-6 sm:gap-8 lg:gap-10 
        px-3 sm:px-6 lg:px-20 
        mt-10 sm:mt-14 mb-8 sm:mb-16
      "
    >
      {safeGuides.map((guide, index) => {
        const id = guide._id || guide.id;

        const subject = guide.subject || guide.category || "Study Guide";
        const title = guide.title || "Complete Guide";

        const priceNumber =
          typeof guide.price === "number" ? guide.price : Number(guide.price);
        const price = isNaN(priceNumber) ? "₹49" : `₹${priceNumber}`;

        const chapters = guide.chapters || 0;
        const description =
          guide.shortDescription ||
          guide.description ||
          "Premium 12th standard guide with solved examples and exam-focused explanations.";

        // local image selection
        const subjLower = (subject || "").toLowerCase();
        const titleLower = (title || "").toLowerCase();
        let imgSrc = maths;

        if (subjLower.includes("physics") || titleLower.includes("physics")) {
          imgSrc = physics;
        } else if (subjLower.includes("chem") || titleLower.includes("chem")) {
          imgSrc = chemistry;
        } else if (
          subjLower.includes("math") ||
          subjLower.includes("mathematics") ||
          titleLower.includes("math")
        ) {
          imgSrc = maths;
        }

        // local paid flag
        const paidKey =
          currentUserId && id ? `paid_${currentUserId}_${id}` : null;
        const isPaid = paidKey
          ? localStorage.getItem(paidKey) === "true"
          : false;

        return (
          <motion.div
            key={id || index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            viewport={{ once: true }}
            className="relative group"
          >
            {/* subtle glow on hover */}
            <div
              className="
                absolute -inset-[1px]
                bg-gradient-to-r from-blue-400/35 via-blue-500/25 to-indigo-500/35
                rounded-3xl blur-xl opacity-0
                group-hover:opacity-100 transition-all duration-700
              "
            />

            <Card
              className="
                relative h-full flex flex-col
                rounded-3xl border border-blue-100/70 
                bg-white/90 backdrop-blur-sm 
                shadow-sm hover:shadow-xl hover:-translate-y-2
                transition-all duration-500
                overflow-hidden z-10
              "
            >
              {/* IMAGE + PURCHASED BADGE */}
              <CardHeader className="pb-0 pt-0 px-0">
                {/* removed inner bg and border so image bleeds to card edges */}
                <div className="relative rounded-t-2xl overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={title}
                    style={{ objectPosition: "top" }}
                    className="
                      w-full
                      h-90        /* mobile: compact */
                      sm:h-48     /* small screens */
                      md:h-64     /* tablets */
                      lg:h-80     /* desktop big */
                      xl:h-96     /* xl desktop */
                      object-cover
                      transition-transform duration-500
                      group-hover:scale-[1.03]
                    "
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />

                  {isPaid && (
                    <div
                      className="
                        absolute top-3 left-3
                        rounded-full bg-emerald-500/95 text-white
                        text-[10px] sm:text-xs font-semibold
                        px-2.5 py-1 flex items-center gap-1 shadow-sm
                      "
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Purchased
                    </div>
                  )}
                </div>
              </CardHeader>

              {/* CONTENT */}
              <CardContent className="px-5 sm:px-6 pt-4 pb-3 flex-1 flex flex-col gap-2 text-center">
                <button
                  onClick={() =>
                    navigate(`/book-detail/${guide._id || guide.id}`, {
                      state: { guide },
                    })
                  }
                  className="
                    text-sm sm:text-base font-extrabold text-slate-900 
                    hover:text-blue-700 transition-colors
                    lg:text-lg
                  "
                >
                  {title}
                </button>

                <p className="text-xs sm:text-sm lg:text-[13px] xl:text-[12px] text-slate-700 leading-relaxed mt-1">
                  {description}
                </p>

                <p className="text-xs sm:text-sm font-semibold text-blue-600 mt-1">
                  Chapters: {chapters}
                </p>
              </CardContent>

              {/* FOOTER */}
              <CardFooter className="px-5 sm:px-6 pt-2 pb-5 border-t border-blue-100/70 bg-slate-50/70 flex flex-col gap-2">
                <div className="flex items-end justify-between w-full">
                  <div>
                    <p
                      className="
                        text-2xl sm:text-3xl font-extrabold 
                        bg-gradient-to-r from-blue-600 to-indigo-600 
                        bg-clip-text text-transparent
                      "
                    >
                      {price}
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-500">
                      one-time
                    </p>
                    {isPaid && (
                      <p className="text-[11px] sm:text-xs text-emerald-600 font-semibold mt-1">
                        Already purchased
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() =>
                      navigate(`/book-detail/${guide._id}`, { state: { guide } })
                    }
                    className="
                      rounded-full px-5 sm:px-7 py-2 sm:py-2.5
                      text-xs sm:text-sm font-semibold
                      bg-blue-600 hover:bg-blue-700 
                      text-white shadow-md
                    "
                  >
                    {isPaid ? "View Guide" : "Buy Now"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GuideCard;
