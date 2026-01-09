import React from "react";
import { CheckCircle } from "lucide-react";

const CoursePriceCard = ({ course, onBuy }) => {
  if (!course) return null;

  return (
    <div className="
      rounded-2xl
      border border-white/10
      bg-neutral-900/80 backdrop-blur
      shadow-xl
      overflow-hidden
    ">
      <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />

      <div className="p-6 text-center space-y-2">
        <p className="text-xs uppercase tracking-wider text-gray-400">
          limited time offer
        </p>

        <p className="text-4xl font-bold text-white">
          ₹{course.price}
        </p>

        <p className="text-xs text-gray-400">
          save ₹{(course.originalPrice || 2999) - course.price} today
        </p>
      </div>

      <div className="px-6">
        <button
          onClick={onBuy}
          className="
            block w-full text-center
            bg-gradient-to-r from-violet-600 to-indigo-600
            shadow-md shadow-blue-500/20 hover:bg-purple-700
            py-3 rounded-xl font-semibold
            transition
          "
        >
          buy now
        </button>

        <p className="mt-2 text-center text-xs text-gray-500">
          30-day money-back guarantee
        </p>
      </div>

      <div className="my-5 border-t border-white/10" />

      <div className="px-6 pb-6">
        <p className="text-sm font-medium mb-4 text-white">
          this course includes
        </p>

        <ul className="space-y-3 text-sm text-gray-300">
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-400" />
            {course.hours} hours on-demand video
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-400" />
            lifetime access
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-400" />
            certificate of completion
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-400" />
            full refund within 30 days
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CoursePriceCard;
