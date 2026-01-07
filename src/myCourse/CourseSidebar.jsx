import { Clock, CheckCircle2, BookOpen, Edit3, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* Icon helper */
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
  modules,
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
          fixed sm:relative z-50
          bg-[#0B0B0B] border-r border-white/10
          h-full overflow-y-auto
          transition-transform duration-300 ease-in-out
        `,
          /* Width */
          "w-[85%] max-w-[320px] sm:w-72",

          /* Slide behavior */
          isOpen ? "translate-x-0" : "-translate-x-full",
          "sm:translate-x-0"
        )}
      >
        <div className="p-4 sm:p-5">
          {/* Mobile header */}
          <div className="flex items-center justify-between sm:hidden mb-4">
            <h2 className="text-lg font-semibold text-white">
              Course Content
            </h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Desktop header */}
          <h2 className="hidden sm:block text-lg font-semibold text-white mb-6">
            Course Content
          </h2>

          {/* Modules */}
          <div className="space-y-10">
            {modules.map((module) => (
              <div key={module.id} className="relative">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-4 pl-10">
                  {module.title}
                </h3>

                {/* Timeline */}
                <div className="absolute left-4 top-7 bottom-0 w-px bg-white/10" />

                {module.lessons.map((lesson) => {
                  const isActive = lesson.id === currentLessonId;
                  const isCompleted = lesson.completed;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => {
                        onLessonSelect(lesson.id);
                        onClose(); // close drawer on mobile
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
                          flex items-center justify-center
                        `,
                          isCompleted
                            ? "bg-purple-500 border-purple-500"
                            : isActive
                            ? "border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.9)]"
                            : "border-white/30"
                        )}
                      >
                        {isCompleted && (
                          <CheckCircle2 className="w-3 h-3 text-black" />
                        )}
                      </div>

                      {/* Lesson text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-sm font-medium truncate",
                              isActive
                                ? "text-white"
                                : "text-white/80"
                            )}
                          >
                            {lesson.title}
                          </span>

                          {getLessonIcon(lesson.type) && (
                            <span className="text-white/40">
                              {getLessonIcon(lesson.type)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 mt-1 text-xs text-white/40">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default CourseSidebar;
