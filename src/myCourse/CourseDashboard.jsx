import { useState, useEffect } from "react";
import { MessageSquare, HelpCircle, ChevronsLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseSidebar from "./CourseSidebar";
import VideoPlayer from "./VideoPlayer";
import NotesDiscussions from "./NotesDiscussions";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Api";

const CourseDashboard = () => {
  const [course, setCourse] = useState(null);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/courses/${courseId}`)
      .then(res => {
        if (!res.data.data.isPurchased) {
          alert("You have not purchased this course");
          navigate("/my-course");
          return;
        }

        setCourse(res.data.data);

        // auto select first chapter
        if (res.data.data.chapters?.length > 0) {
          setCurrentLessonId(res.data.data.chapters[0]._id);
        }
      })
      .catch(() => navigate("/my-course"));
  }, [courseId, navigate]);

  // ⛔ IMPORTANT GUARD
  if (!course) {
    return <div className="text-center mt-40">Loading course...</div>;
  }

  return (
    <div className="flex h-screen bg-background mt-22">
      <CourseSidebar
        modules={course.chapters || []}   // ✅ ALWAYS ARRAY
        currentLessonId={currentLessonId}
        onLessonSelect={setCurrentLessonId}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="sm:hidden mb-4 px-2 py-1 rounded-lg bg-purple-600 text-white"
          >
            <ChevronsLeft />
          </button>

          <VideoPlayer title="Lesson Video" />

          <div className="flex items-center gap-4 mt-4">
            <Button variant="ghost" className="bg-primary/10 gap-2">
              <MessageSquare className="w-4 h-4" /> Submit Feedback
            </Button>

            <Button variant="ghost" className="bg-primary/10 gap-2">
              <HelpCircle className="w-4 h-4" /> Ask doubt
            </Button>
          </div>

         <NotesDiscussions courseId={course._id} />
        </div>
      </main>
    </div>
  );
};

export default CourseDashboard;
