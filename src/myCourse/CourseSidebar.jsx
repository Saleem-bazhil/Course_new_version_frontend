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
  modules = [],
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
        "relative flex gap-3 pl-10 pr-3 py-3 rounded-lg cursor-pointer",
        isActive ? "bg-purple-500/10" : "hover:bg-white/5"
      )}
    >
      {/* Dot */}
      <div
        className={cn(
          "absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2",
          isActive ? "border-purple-500" : "border-white/30"
        )}
      />

      {/* Chapter text */}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-white truncate">
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
      </aside>
    </>
  );
};

export default CourseSidebar;
