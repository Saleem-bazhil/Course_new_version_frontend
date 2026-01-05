import React from "react";
import { CheckCircle } from "lucide-react";

const CoursePriceCard = ({ course }) => {
  if (!course) return null;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-xl overflow-hidden shadow-xl">

      {/* PRICE HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
        <p className="text-xs uppercase tracking-wide opacity-90">
          Limited Time Offer
        </p>

        <p className="text-4xl font-semibold mt-2">
          ₹{course.price}
        </p>

        <p className="text-xs opacity-90 mt-1">
          Save ₹{(course.originalPrice || 2999) - course.price} today
        </p>
      </div>

      {/* CONTENT */}
      <div className="p-6 space-y-6">
        <a
          href={`/payment/${course._id}`}
          className="block text-center bg-purple-600 hover:bg-purple-700 py-3 rounded-full font-medium transition shadow-lg shadow-purple-600/30"
        >
          Buy Now
        </a>

        <p className="text-center text-xs text-gray-400">
          30-day money-back guarantee
        </p>

        <div className="border-t border-neutral-800 pt-4">
          <p className="text-sm font-medium mb-4">
            This course includes:
          </p>

          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex gap-2 items-center">
              <CheckCircle size={16} className="text-green-400" />
              {course.hours} hours on-demand video
            </li>
            <li className="flex gap-2 items-center">
              <CheckCircle size={16} className="text-green-400" />
              Lifetime access
            </li>
            <li className="flex gap-2 items-center">
              <CheckCircle size={16} className="text-green-400" />
              Certificate of completion
            </li>
            <li className="flex gap-2 items-center">
              <CheckCircle size={16} className="text-green-400" />
              Full refund within 30 days
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoursePriceCard;
