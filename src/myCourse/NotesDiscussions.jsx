import { useState, useEffect } from "react";
import { Plus, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "./RichTextEditor";
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

  /* NOTES STATE */
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [notes, setNotes] = useState(mockNotes);

  /* DISCUSSIONS STATE */
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null); // commentId
  const [replyText, setReplyText] = useState({}); // { commentId: text }

  /* ===== FETCH COMMENTS ===== */
  useEffect(() => {
    if (!courseId) return;

    api
      .get(`/comments/course/${courseId}`)
      .then((res) => setComments(res.data.data))
      .catch(console.error);
  }, [courseId]);

  /* ===== ADD COMMENT ===== */
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const res = await api.post("/comments", {
      content: newComment,
      courseId,
    });

    setComments((prev) => [res.data.data, ...prev]);
    setNewComment("");
  };

  /* ===== ADD REPLY ===== */
  const handleAddReply = async (parentId) => {
    const text = replyText[parentId];
    if (!text?.trim()) return;

    const res = await api.post("/comments", {
      content: text,
      courseId,
      parentComment: parentId,
    });

    setComments((prev) =>
      prev.map((c) =>
        c._id === parentId
          ? { ...c, replies: [...(c.replies || []), res.data.data] }
          : c
      )
    );

    setReplyText((prev) => {
      const copy = { ...prev };
      delete copy[parentId];
      return copy;
    });

    setReplyTo(null);
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
            {notes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl border border-white/10 p-5"
              >
                <h4 className="text-white font-semibold">{note.title}</h4>
                <p className="text-white/60">{note.content}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ================= DISCUSSIONS TAB ================= */}
        <TabsContent value="discussions" className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-purple-500">
              Discussions
            </h3>
            <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
              <Plus className="w-4 h-4" /> ASK A QUESTION
            </Button>
          </div>

          {/* MAIN COMMENT INPUT */}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ask a question..."
            className="w-full bg-transparent border border-white/10 rounded-lg p-3"
          />

          <Button onClick={handleAddComment} className="mt-3">
            Post
          </Button>

          {/* COMMENTS LIST */}
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
                        {new Date(
                          discussion.createdAt
                        ).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-sm text-white/60 mt-1">
                      {discussion.content}
                    </p>

                    <button
                      onClick={() =>
                        setReplyTo(
                          replyTo === discussion._id
                            ? null
                            : discussion._id
                        )
                      }
                      className="flex items-center gap-1 mt-3 text-xs text-purple-400"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Reply
                    </button>

                    {/* REPLY INPUT */}
                    {replyTo === discussion._id && (
                      <div className="mt-3">
                        <textarea
                          value={replyText[discussion._id] || ""}
                          onChange={(e) =>
                            setReplyText((prev) => ({
                              ...prev,
                              [discussion._id]: e.target.value,
                            }))
                          }
                          placeholder="Write a reply..."
                          className="w-full bg-transparent border border-white/10 rounded-lg p-2 text-sm"
                        />

                        <Button
                          size="sm"
                          className="mt-2"
                          onClick={() =>
                            handleAddReply(discussion._id)
                          }
                        >
                          Post Reply
                        </Button>
                      </div>
                    )}

                    {/* REPLIES */}
                    {discussion.replies?.length > 0 && (
                      <div className="mt-4 space-y-4 pl-6 border-l border-white/10">
                        {discussion.replies.map((reply) => (
                          <div
                            key={reply._id}
                            className="flex gap-3"
                          >
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                              <User className="w-4 h-4 text-purple-400" />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-white">
                                  {reply.user?.name || "User"}
                                </span>
                                <span className="text-xs text-white/40">
                                  {new Date(
                                    reply.createdAt
                                  ).toLocaleString()}
                                </span>
                              </div>

                              <p className="text-sm text-white/60">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
