import { Clock, CheckCircle2, BookOpen, Edit3, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* Icon helper (kept for future use) */
const getLessonIcon = (type) => {
  switch (type) {
    case "tutorial":
      return <BookOpen className="w-4 h-4" />;
    case "mcq":
    case "coding":
      return <Edit3 className="w-4 h-4" />;
    default:
      return null;
  }
};

const CourseSidebar = ({
  modules = [],              // chapters array from backend
  currentLessonId,
  onLessonSelect,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* ===== Overlay (mobile only) ===== */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/70 z-40 sm:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* ===== Sidebar ===== */}
   <aside
  className={cn(
    `
      fixed sm:relative z-40
      top-16 sm:top-0
      bg-[#0B0B0B] border-r border-white/10
      h-[calc(100vh-4rem)] sm:h-full
      overflow-y-auto
      transition-transform duration-300 ease-in-out
    `,
    "w-[85%] max-w-[320px] sm:w-72",
    isOpen ? "translate-x-0" : "-translate-x-full",
    "sm:translate-x-0"
  )}
>

        <div className="p-4 sm:p-5">
          {/* Mobile header */}
          <div className="flex items-center justify-between sm:hidden mb-4">
            {/* <h2 className="text-lg font-semibold text-white">
              Course Content
            </h2> */}
            <button onClick={onClose}>
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Desktop header */}
          {/* <h2 className="hidden sm:block text-lg font-semibold text-white mb-6">
            Course Content
          </h2> */}

          {/* ===== OLD STYLE MODULE UI ===== */}
          <div className="space-y-10">
            {/* Single visual module */}
            <div className="relative">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-4 pl-10">
                Course Chapters
              </h3>

              {/* Timeline */}
              <div className="absolute left-4 top-7 bottom-0 w-px bg-white/10" />

              {/* Chapters */}
              {modules.length === 0 && (
                <p className="pl-10 text-sm text-white/40">
                  No chapters available
                </p>
              )}

              {modules.map((chapter) => {
                const isActive = chapter._id === currentLessonId;

                return (
                  <div
                    key={chapter._id}
                    onClick={() => {
                      onLessonSelect(chapter._id);
                      onClose();
                    }}
                    className={cn(
                      `
                        relative flex gap-3
                        pl-10 pr-3 py-3
                        rounded-lg cursor-pointer
                        transition-all
                      `,
                      isActive
                        ? "bg-purple-500/10"
                        : "hover:bg-white/5"
                    )}
                  >
                    {/* Dot */}
                    <div
                      className={cn(
                        `
                          absolute left-4 top-1/2
                          -translate-x-1/2 -translate-y-1/2
                          w-3 h-3 rounded-full border-2
                        `,
                        isActive
                          ? "border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.9)]"
                          : "border-white/30"
                      )}
                    >
                      {isActive && (
                        <CheckCircle2 className="w-3 h-3 text-purple-500" />
                      )}
                    </div>

                    {/* Chapter text */}
                    <div className="flex-1 min-w-0">
                      <span
                        className={cn(
                          "text-sm font-medium truncate",
                          isActive ? "text-white" : "text-white/80"
                        )}
                      >
                        {chapter.chapter_title}
                      </span>

                      <div className="flex items-center gap-1 mt-1 text-xs text-white/40">
                        <Clock className="w-3 h-3" />
                        <span>{chapter.duration} mins</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CourseSidebar;
