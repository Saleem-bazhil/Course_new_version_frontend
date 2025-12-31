import React from "react";

const CourseCard = () => {
  return (
    <div className="relative h-full">
      <div
        className="
          group
          h-full
          bg-neutral-900 rounded-2xl overflow-hidden
          border border-neutral-800
          flex flex-col
          transform-gpu transition-all duration-300 ease-out
          md:hover:-translate-y-4
          md:hover:shadow-[0_25px_60px_rgba(0,0,0,0.7)]
          md:hover:border-purple-500
        "
      >
        {/* IMAGE */}
        <div className="relative h-44 sm:h-48 md:h-52 overflow-hidden shrink-0">
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
            alt="Course Thumbnail"
            className="
              w-full h-full object-cover
              transition-transform duration-500
              md:group-hover:scale-110
            "
          />

          {/* BADGES */}
          <span className="absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1 sm:px-4 rounded-full text-xs sm:text-sm bg-green-600">
            Beginner
          </span>

          <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1 sm:px-4 rounded-full text-xs sm:text-sm bg-purple-600">
            Web Development
          </span>
        </div>

        {/* CONTENT */}
        <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">
            Full Stack Web Development Course
          </h3>

          <p className="text-gray-400 mb-3 sm:mb-4 text-sm line-clamp-3">
            Learn HTML, CSS, JavaScript, React, and backend development
          </p>
          {/* STATS */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-5">
            <span className="flex items-center gap-1">⭐ 4.8</span>
            <span className="flex items-center gap-1">👥 1,250 Students</span>
            <span className="flex items-center gap-1">⏱ 42h</span>
          </div>

          {/* FOOTER */}
          <div className="mt-auto flex items-center justify-between gap-3">
            <span className="text-xl sm:text-2xl font-bold">
              ₹2,999
            </span>

            <a
              href="/details"
              className="
                px-4 py-2
                text-sm sm:text-base
                rounded-lg
                bg-purple-600 hover:bg-purple-700
                transition
                whitespace-nowrap
              "
            >
              Enroll
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
