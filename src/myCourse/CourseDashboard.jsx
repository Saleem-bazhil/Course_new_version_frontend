import { useState } from "react";
import { MessageSquare, HelpCircle ,ChevronsLeft} from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseSidebar from "./CourseSidebar";
import VideoPlayer from "./VideoPlayer";
import NotesDiscussions from "./NotesDiscussions";

const mockModules = [
  {
    id: "1",
    title: "Graph Algorithms",
    lessons: [
      { id: "1-1", title: "Find Bridges", duration: "47 mins", type: "video", completed: true },
      { id: "1-2", title: "Tutorial | Find Bridges", duration: "30 mins", type: "tutorial", completed: false },
      { id: "1-3", title: "MCQ Practice | Find Bridges", duration: "10 mins", type: "mcq", completed: false },
      { id: "1-4", title: "Coding Practice | Find Bridges", duration: "30 mins", type: "coding", completed: false },
      { id: "1-5", title: "Articulation Points", duration: "55 mins", type: "video", completed: false },
      { id: "1-6", title: "Tutorial | Articulation Points", duration: "30 mins", type: "tutorial", completed: false },
      { id: "1-7", title: "MCQ Practice | Articulation Points", duration: "10 mins", type: "mcq", completed: false },
      { id: "1-8", title: "Coding Practice | Articulation Points", duration: "30 mins", type: "coding", completed: false },
    ],
  },
  {
    id: "2",
    title: "MERN Stack",
    lessons: [
      { id: "2-1", title: "MongoDB Fundamentals", duration: "52 mins", type: "video", completed: true },
      { id: "2-2", title: "Tutorial | MongoDB CRUD", duration: "35 mins", type: "tutorial", completed: true },
      { id: "2-3", title: "Express.js Setup", duration: "40 mins", type: "video", completed: true },
      { id: "2-4", title: "REST API Design", duration: "48 mins", type: "video", completed: false },
      { id: "2-5", title: "Coding Practice | REST API", duration: "45 mins", type: "coding", completed: false },
      { id: "2-6", title: "React Components", duration: "55 mins", type: "video", completed: false },
      { id: "2-7", title: "Tutorial | React Hooks", duration: "40 mins", type: "tutorial", completed: false },
      { id: "2-8", title: "Node.js Authentication", duration: "60 mins", type: "video", completed: false },
      { id: "2-9", title: "MCQ Practice | MERN Stack", duration: "15 mins", type: "mcq", completed: false },
    ],
  },
  {
    id: "3",
    title: "Python Mastery",
    lessons: [
      { id: "3-1", title: "Python Basics", duration: "45 mins", type: "video", completed: true },
      { id: "3-2", title: "Data Structures in Python", duration: "58 mins", type: "video", completed: true },
      { id: "3-3", title: "Tutorial | Lists & Dicts", duration: "30 mins", type: "tutorial", completed: true },
      { id: "3-4", title: "Object-Oriented Python", duration: "65 mins", type: "video", completed: true },
      { id: "3-5", title: "Coding Practice | OOP", duration: "40 mins", type: "coding", completed: false },
      { id: "3-6", title: "File Handling & I/O", duration: "35 mins", type: "video", completed: false },
      { id: "3-7", title: "Python Libraries: NumPy", duration: "50 mins", type: "video", completed: false },
      { id: "3-8", title: "Tutorial | Pandas Basics", duration: "45 mins", type: "tutorial", completed: false },
      { id: "3-9", title: "MCQ Practice | Python", duration: "12 mins", type: "mcq", completed: false },
      { id: "3-10", title: "Final Project | Data Analysis", duration: "90 mins", type: "coding", completed: false },
    ],
  },
  {
    id: "4",
    title: "Flutter Development",
    lessons: [
      { id: "4-1", title: "Dart Language Basics", duration: "50 mins", type: "video", completed: true },
      { id: "4-2", title: "Flutter Setup & First App", duration: "40 mins", type: "video", completed: true },
      { id: "4-3", title: "Tutorial | Widgets Deep Dive", duration: "55 mins", type: "tutorial", completed: false },
      { id: "4-4", title: "State Management", duration: "62 mins", type: "video", completed: false },
      { id: "4-5", title: "Coding Practice | Provider", duration: "45 mins", type: "coding", completed: false },
      { id: "4-6", title: "Navigation & Routing", duration: "38 mins", type: "video", completed: false },
      { id: "4-7", title: "API Integration", duration: "55 mins", type: "video", completed: false },
      { id: "4-8", title: "Tutorial | Firebase Auth", duration: "48 mins", type: "tutorial", completed: false },
      { id: "4-9", title: "MCQ Practice | Flutter", duration: "10 mins", type: "mcq", completed: false },
      { id: "4-10", title: "Build & Deploy", duration: "35 mins", type: "video", completed: false },
    ],
  },
];

const CourseDashboard = () => {
  const [currentLessonId, setCurrentLessonId] = useState("1-5");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const currentLesson = mockModules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === currentLessonId);

  return (
    <div className="flex h-screen bg-background mt-22">
      {/* Sidebar */}
      <CourseSidebar
        modules={mockModules}
        currentLessonId={currentLessonId}
        onLessonSelect={setCurrentLessonId}
         isOpen={isSidebarOpen}
  onClose={() => setIsSidebarOpen(false)}

      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6">
          <button
  onClick={() => setIsSidebarOpen(true)}
  className="sm:hidden mb-4 px-4 py-2 rounded-lg bg-purple-600 text-white"
>
  <ChevronsLeft />
</button>
          {/* Video Player */}
          <VideoPlayer title={currentLesson?.title || "Loading..."} />

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-4">
            <Button
              variant="ghost"
              className="text-primary hover:text-primary bg-primary/10 gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Submit Feedback
            </Button>

            <Button
              variant="ghost"
              className="text-primary hover:text-primary bg-primary/10 gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              Ask doubt
            </Button>
          </div>

          {/* Notes & Discussions */}
          <NotesDiscussions />
        </div>
      </main>
    </div>
  );
};

export default CourseDashboard;
