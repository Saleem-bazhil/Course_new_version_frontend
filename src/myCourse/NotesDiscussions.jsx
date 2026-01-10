import { useState, useEffect } from "react";
import { Plus, MessageCircle, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "./RichTextEditor";
import { cn } from "@/lib/utils";
import api from "../Api";

/* ================= NOTES (UNCHANGED) ================= */

const mockNotes = [
  {
    id: "1",
    title: "Key concepts in Find Bridges",
    content:
      "Bridges in a graph are edges whose removal disconnects the graph...",
    timestamp: "2 hours ago",
    lessonTitle: "Find Bridges",
  },
];

/* ================= COMPONENT ================= */

const NotesDiscussions = ({ courseId }) => {
  const [activeTab, setActiveTab] = useState("notes");

  /* NOTES STATE (UNCHANGED) */
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [notes, setNotes] = useState(mockNotes);

  /* 🔴 DISCUSSIONS (REAL DATA) */
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  /* ===== FETCH COMMENTS ===== */
  useEffect(() => {
    if (!courseId) return;

    api
      .get(`/comments/course/${courseId}`)
      .then(res => setComments(res.data.data))
      .catch(console.error);
  }, [courseId]);

  /* ===== ADD COMMENT ===== */
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const res = await api.post("/comments", {
      content: newComment,
      courseId,
    });

    setComments([res.data.data, ...comments]);
    setNewComment("");
  };

  /* NOTES SAVE (UNCHANGED) */
  const handleSaveNote = () => {
    if (noteTitle.trim() || noteContent.trim()) {
      const newNote = {
        id: Date.now().toString(),
        title: noteTitle || "Untitled Note",
        content: noteContent,
        timestamp: "Just now",
        lessonTitle: "Current Lesson",
      };
      setNotes([newNote, ...notes]);
    }
    setNoteTitle("");
    setNoteContent("");
    setIsEditorOpen(false);
  };

  const handleCancel = () => {
    setNoteTitle("");
    setNoteContent("");
    setIsEditorOpen(false);
  };

  return (
    <div className="mt-10 w-full max-w-[1100px]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

        {/* ================= TABS ================= */}
        <TabsList className="bg-transparent border-b border-white/10 rounded-none w-full justify-start h-auto p-0 gap-8">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
        </TabsList>

        {/* ================= NOTES TAB ================= */}
        <TabsContent value="notes" className="mt-8">
          {/* UNCHANGED UI */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-purple-500">Notes</h3>
            {!isEditorOpen && (
              <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
                <Plus className="w-4 h-4" /> NEW NOTE
              </Button>
            )}
          </div>

          {isEditorOpen && (
            <RichTextEditor
              title={noteTitle}
              content={noteContent}
              onTitleChange={setNoteTitle}
              onContentChange={setNoteContent}
              onSave={handleSaveNote}
              onCancel={handleCancel}
            />
          )}

          <div className="space-y-6">
            {notes.map(note => (
              <div key={note.id} className="rounded-xl border border-white/10 p-5">
                <h4 className="text-white font-semibold">{note.title}</h4>
                <p className="text-white/60">{note.content}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ================= DISCUSSIONS TAB ================= */}
        <TabsContent value="discussions" className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-purple-500">Discussions</h3>
            <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
              <Plus className="w-4 h-4" /> ASK A QUESTION
            </Button>
          </div>

          {/* 🔴 SAME UI – ONLY DATA CHANGED */}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ask a question..."
            className="w-full bg-transparent border border-white/10 rounded-lg p-3"
          />

          <Button onClick={handleAddComment} className="mt-3">
            Post
          </Button>

          <div className="space-y-6 mt-6">
            {comments.map((discussion) => (
              <div
                key={discussion._id}
                className="rounded-xl border border-white/10 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">
                        {discussion.user?.name || "User"}
                      </span>
                      <span className="text-xs text-white/40">
                        {new Date(discussion.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-sm text-white/60 mt-1">
                      {discussion.content}
                    </p>

                    <div className="flex items-center gap-2 mt-3 text-xs text-purple-400">
                      <MessageCircle className="w-4 h-4" />
                      <span>Reply</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotesDiscussions;
