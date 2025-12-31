import React, { useState } from "react";
import { Play, Lock } from "lucide-react";

const Section = ({ title, time, lessons }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-gradient-to-r from-white/5 to-white/0">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-4 text-left"
      >
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>
        <span className="text-sm text-gray-400">{time}</span>
      </button>

      {/* Lessons */}
      {open && (
        <div className="px-6 pb-4 space-y-3">
          {lessons.map((lesson, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-gray-200"
            >
              {lesson.open ? (
                <Play className="w-4 h-4 text-purple-400" />
              ) : (
                <Lock className="w-4 h-4 text-gray-400" />
              )}
              <span>{lesson.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Section;
