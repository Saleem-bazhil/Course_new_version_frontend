import React from "react";
import { Play } from "lucide-react";

const CourseCurriculum = ({ chapters }) => {
  if (!Array.isArray(chapters) || chapters.length === 0) {
    return (
      <p className="text-gray-400">
        No chapters available for this course.
      </p>
    );
  }

  return (
    <div className="mt-16">
      {/* TITLE */}
      <h2 className="text-3xl font-semibold mb-10 text-white">
        Course Curriculum
      </h2>

      <div className="space-y-5">
        {chapters.map((chapter, index) => (
          <div
            key={chapter._id || index}
            className="
              group relative overflow-hidden
              rounded-2xl border border-white/10
              bg-gradient-to-br from-white/[0.06] to-white/[0.02]
              hover:border-purple-500/40
              hover:shadow-lg hover:shadow-purple-500/10
              transition-all duration-300
            "
          >
            {/* LEFT ACCENT */}
            <div className="absolute left-0 top-0 h-full w-1 bg-purple-500/70 opacity-0 group-hover:opacity-100 transition" />

            <div className="flex items-start justify-between gap-6 px-6 py-5">
              {/* TEXT */}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">
                  Chapter {index + 1}: {chapter.chapter_title}
                </h3>

                {chapter.chapter_description && (
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {chapter.chapter_description}
                  </p>
                )}

                {/* ACTION */}
                <div className="mt-3 inline-flex items-center gap-2 text-sm text-purple-400 group-hover:text-purple-300 transition">
                  <Play size={16} />
                  <span className="font-medium">Watch Chapter</span>
                </div>
              </div>

              {/* DURATION BADGE */}
              <span
                className="
                  shrink-0 rounded-full
                  bg-black/40 border border-white/10
                  px-4 py-1 text-xs font-medium text-gray-300
                "
              >
                {chapter.duration} min
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseCurriculum;
