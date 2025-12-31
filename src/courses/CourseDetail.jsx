import React from "react";
import {
  ArrowLeft,
  Star,
  Users,
  Clock,
  CheckCircle,
  PlayCircle,
} from "lucide-react";
import Coursecirculam from "./Coursecirculam";

const CourseDetail = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* TOP BAR */}
      <div className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-gray-400">
          <ArrowLeft size={18} />
          <a href="/courses" className="hover:text-white transition">
            Back to Courses
          </a>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-14">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          {/* TAGS */}
          <div className="flex gap-3">
            <span className="px-3 py-1 text-xs rounded-full bg-purple-600/20 text-purple-400">
              Development
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-neutral-800 text-gray-300">
              Beginner Friendly
            </span>
          </div>

          {/* TITLE */}
          <h1 className="text-4xl font-semibold leading-tight">
            Complete Web Development Bootcamp
          </h1>

          {/* DESCRIPTION */}
          <p className="text-gray-400 max-w-2xl leading-relaxed">
            Master HTML, CSS, JavaScript, React, Node.js, and modern tools by
            building real-world projects from scratch.
          </p>

          {/* STATS */}
          <div className="flex flex-wrap gap-8 text-sm text-gray-300">
            <span className="flex items-center gap-2">
              <Star size={16} className="text-yellow-400" />
              4.8 (2,100 reviews)
            </span>
            <span className="flex items-center gap-2">
              <Users size={16} />
              12,453 students
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} />
              42 hours
            </span>
          </div>

          {/* HERO IMAGE */}
          <div className="relative rounded-2xl overflow-hidden border border-neutral-800">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
              alt="Course"
              className="w-full h-[320px] object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <PlayCircle className="h-16 w-16 text-white/80" />
            </div>
          </div>
        </div>

        {/* PRICE CARD */}
        <div className="sticky top-24 h-fit">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-xl overflow-hidden shadow-xl">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
              <p className="text-xs uppercase tracking-wide opacity-90">
                Limited Time Offer
              </p>
              <p className="text-4xl font-semibold mt-2">
                <span className="line-through text-white/50 mr-2">
                  $125.99
                </span>
                $89.99
              </p>
              <p className="text-xs opacity-90 mt-1">
                Save $36 today
              </p>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-6">
              <a
                href="/payment"
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
                    42 hours on-demand video
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
        </div>
      </div>

      <Coursecirculam/>
    </div>
  );
};

export default CourseDetail;
