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
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://res.cloudinary.com/dwupqb1pj/image/upload/v1767118727/2_Samacheer_Kalvi_2_aiqnsi.png";

const maths =
  "https://res.cloudinary.com/dwupqb1pj/image/upload/v1767119000/2_Samacheer_Kalvi_2_bbs5gv.png";
const chemistry =
  "https://res.cloudinary.com/dwupqb1pj/image/upload/v1767118619/2_Samacheer_Kalvi_3_tmcdq9.png";
const physics = maths;

const GuideCard = ({ guides, forceView = false }) => {
  const safeGuides = Array.isArray(guides) ? guides : [];
  const navigate = useNavigate();

  if (!safeGuides.length) {
    return (
      <div className="mt-10 text-center text-muted-foreground">
        No guides found.
      </div>
    );
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
        const title = guide.title || "Complete Guide";

        const priceNumber =
          typeof guide.price === "number" ? guide.price : Number(guide.price);
        const price = isNaN(priceNumber) ? "₹49" : `₹${priceNumber}`;

        const chapters = guide.chapters || 0;
        const description =
          guide.shortDescription ||
          guide.description ||
          "Premium 12th standard guide with solved examples.";

        const isPaid = forceView || guide.isPurchased === true;
        // image logic for temporary guides without images
        const subject = (guide.title || "").toLowerCase();

        let imgSrc =
          guide.image ||
          guide.imageUrl ||
          guide.image_detail?.url ||
          guide.image_detail?.secure_url;

        if (!imgSrc) {
          if (subject.includes("chem")) imgSrc = chemistry;
          else if (subject.includes("math")) imgSrc = maths;
          else if (subject.includes("physics")) imgSrc = physics;
          else imgSrc = FALLBACK_IMAGE;
        }

        return (
          <motion.div
            key={id || index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div
              className="
              absolute -inset-[1.5px]
              rounded-3xl
              border border-purple-500/70
              opacity-0
              transition-all duration-300
              group-hover:opacity-100
              pointer-events-none
            "
            />

            <Card
              className="
              relative h-full flex flex-col
              rounded-3xl border border-border
              bg-card backdrop-blur-sm
              shadow-sm hover:shadow-xl
              transition-all duration-500
              z-10
            "
            >
              <CardHeader className="pb-0 pt-0 px-0">
                <div className="relative rounded-t-2xl overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={title}
                    className="
                                          transition-transform duration-500
                      group-hover:scale-[1.03]

                     

                    "
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />

                  {isPaid && (
                    <div
                      className="
                      absolute top-3 left-3
                      rounded-full bg-purple-600 text-white
                      text-xs font-semibold px-3 py-1
                      flex items-center gap-1 shadow-sm
                    "
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Purchased
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="px-5 pt-4 pb-3 flex-1 text-center">
                <h3 className="font-extrabold text-white">{title}</h3>
                {/* <p className="text-xs text-grey mt-2 line-clamp-2">
                  {description}
                </p>
                <p className="text-xs font-semibold text-white mt-1">
                  Chapters: {chapters}
                </p> */}
              </CardContent>

              <CardFooter className="px-5 pt-2 pb-5 border-t border-border">
                <div className="flex justify-between w-full items-end">
                  <div>
                    <p className="text-2xl font-extrabold text-white">
                      {price}
                    </p>
                    
                    {isPaid && (
                      <p className="text-xs text-emerald-600 font-semibold">
                        Already purchased
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() =>
                      navigate(isPaid ? `/viewer/${id}` : `/book-detail/${id}`)
                    }
                    className={
                    " relative overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-600  px-6 py-2 rounded-full  transition-all duration-300  hover:scale-110 "
                    }
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
