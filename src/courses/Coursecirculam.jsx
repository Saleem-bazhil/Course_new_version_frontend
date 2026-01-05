import React, { useState } from "react";
import { Play, Lock } from "lucide-react";

const Section = ({ title, time, lessons }) => {
  const [open, setOpen] = useState(true);

  return (
<div className="mb-6 rounded-xl  border border-white/10 bg-gradient-to-r from-white/5 to-white/0">
  {/* Header */}
  <div className="w-full flex justify-between items-center px-6 py-4">
    <h3 className="text-lg font-semibold text-white">
      Section 1: Introduction & Setup
    </h3>
    <span className="text-sm text-gray-400">2h 30m</span>
  </div>

  {/* Lessons */}
  <div className="px-6 pb-4 space-y-3">
    <div className="flex items-center gap-3 text-gray-200">
      <div className="w-4 h-4 rounded-full bg-purple-400" />
      <span>Course Overview</span>
    </div>

    <div className="flex items-center gap-3 text-gray-200">
      <div className="w-4 h-4 rounded-full bg-purple-400" />
      <span>Environment Setup</span>
    </div>

    <div className="flex items-center gap-3 text-gray-400">
      <div className="w-4 h-4 rounded-full bg-gray-500" />
      <span>Getting Started</span>
    </div>
  </div>
</div>

  );
};

export default Section;
