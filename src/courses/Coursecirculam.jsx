import React from "react";
import { Play } from "lucide-react";

const CourseCurriculum = ({ chapters }) => {
  if (!Array.isArray(chapters) || chapters.length === 0) {
    return (
      <p className="text-gray-400 mt-10">
        No chapters available for this course.
      </p>
    );
  }

  return (
    <section className="mt-20">
      {/* title */}
      <h2 className="text-3xl font-semibold mb-12 text-white">
        Course Curriculum
      </h2>

      <div className="space-y-6">
        {chapters.map((chapter, index) => (
          <div
            key={chapter._id || index}
            className="
              group relative overflow-hidden
              rounded-2xl
              border border-white/10
              bg-gradient-to-br from-white/[0.07] to-white/[0.02]
              hover:border-purple-500/40
              hover:shadow-xl hover:shadow-purple-500/10
              transition-all duration-300
            "
          >
            {/* left accent */}
            <div
              className="
                absolute left-0 top-0 h-full w-1
                bg-gradient-to-b from-purple-500 to-indigo-500
                opacity-0 group-hover:opacity-100
                transition
              "
            />

            <div className="flex items-start justify-between gap-6 px-6 py-6">
              {/* text content */}
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-white leading-snug">
                  Chapter {index + 1}: {chapter.chapter_title}
                </h3>

                {chapter.chapter_description && (
                  <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
                    {chapter.chapter_description}
                  </p>
                )}

                {/* action button */}
                <div
                  className="
                    mt-4 inline-flex items-center gap-2
                    rounded-full px-4 py-1.5
                    bg-purple-500/10
                    text-sm font-medium text-purple-400
                    group-hover:bg-purple-500/20
                    group-hover:text-purple-300
                    transition
                  "
                >
                  <Play size={15} />
                  Watch chapter
                </div>
              </div>

              {/* duration */}
              <span
                className="
                  shrink-0
                  rounded-full
                  bg-black/60 backdrop-blur
                  border border-white/10
                  px-4 py-1.5
                  text-xs font-medium text-gray-300
                "
              >
                {chapter.duration} min
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CourseCurriculum;
