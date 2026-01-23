import { useState, useEffect } from "react";
import { Plus, MessageCircle, User, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "./RichTextEditor";
import api from "../Api";

/* ================= COMPONENT ================= */

const NotesDiscussions = ({ courseId }) => {
  const [activeTab, setActiveTab] = useState("notes");

  /* ================= NOTES STATE ================= */
  const [notes, setNotes] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  /* ================= DISCUSSIONS STATE ================= */
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState({});

  /* ================= FETCH NOTES ================= */
  useEffect(() => {
    if (!courseId) return;

    api
      .get(`/notes/course/${courseId}`)
      .then((res) => setNotes(res.data.data))
      .catch(console.error);
  }, [courseId]);

  /* ================= FETCH COMMENTS ================= */
  useEffect(() => {
    if (!courseId) return;

    api
      .get(`/comments/course/${courseId}`)
      .then((res) => setComments(res.data.data))
      .catch(console.error);
  }, [courseId]);

  /* ================= NOTES ACTIONS ================= */
  const openNewNote = () => {
    setEditingId(null);
    setNoteTitle("");
    setNoteContent("");
    setIsEditorOpen(true);
  };
    const isTipTapEmpty = (html) => {
  if (!html) return true;

  const text = html
    .replace(/<[^>]+>/g, "") // remove HTML tags
    .replace(/&nbsp;/g, "")
    .replace(/\s+/g, "")
    .trim();

  return text.length === 0;
};

const handleSaveNote = async () => {
  if (!noteTitle.trim() || isTipTapEmpty(noteContent)) {
    alert("Title and content are required");
    return;
  }

  try {
    if (editingId) {
      const res = await api.put(`/notes/${editingId}`, {
        title: noteTitle,
        content: noteContent,
      });

      setNotes((prev) =>
        prev.map((n) => (n._id === editingId ? res.data.data : n))
      );
    } else {
      const res = await api.post("/notes", {
        title: noteTitle,
        content: noteContent,
        course: courseId,
      });

      setNotes((prev) => [res.data.data, ...prev]);
    }

    // ✅ RESET STATE (THIS WAS MISSING)
    setIsEditorOpen(false);
    setEditingId(null);
    setNoteTitle("");
    setNoteContent("");
  } catch (error) {
    console.error(error);
    alert("Failed to save note");
  }
};



  const handleEditNote = (note) => {
    setEditingId(note._id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setIsEditorOpen(true);
  };

  const handleDeleteNote = async (id) => {
    await api.delete(`/notes/${id}`);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  /* ================= COMMENTS ACTIONS ================= */
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const res = await api.post("/comments", {
      content: newComment,
      courseId,
    });

    setComments((prev) => [res.data.data, ...prev]);
    setNewComment("");
  };

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

  return (
    <div className="mt-10 w-full max-w-[1100px]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* ================= TABS ================= */}
        <TabsList className="bg-transparent border-b border-white/10 rounded-none w-full justify-start gap-8">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
        </TabsList>

        {/* ================= NOTES TAB ================= */}
        <TabsContent value="notes" className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-purple-500">
              Notes
            </h3>
            {!isEditorOpen && (
              <Button
                className="bg-purple-600 hover:bg-purple-700 gap-2"
                onClick={openNewNote}
              >
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
              onCancel={() => setIsEditorOpen(false)}
            />
          )}

          <div className="space-y-6">
       <div className="space-y-6">
  {notes.map((note) => (
    <div
      key={note._id}
      className="rounded-xl border border-white/10 p-5"
    >
      <div className="flex justify-between items-center">
        <h4 className="text-white font-semibold">
          {note.title}
        </h4>

        <div className="flex gap-2">
          <button
            onClick={() => handleEditNote(note)}
            className="text-purple-400"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteNote(note._id)}
            className="text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/*  RENDER HTML CORRECTLY */}
     <div
  className="prose prose-invert max-w-none mt-2 whitespace-pre-wrap break-words"
  style={{
    wordBreak: "break-word",
    overflowWrap: "anywhere",
  }}
  dangerouslySetInnerHTML={{ __html: note.content }}
/>

    </div>
  ))}
</div>

          </div>
        </TabsContent>

{/* ================= DISCUSSIONS TAB ================= */}
<TabsContent value="discussions" className="mt-8">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-lg font-semibold text-purple-500">
      Discussions
    </h3>
  </div>

  {/* ADD COMMENT */}
  <textarea
    value={newComment}
    onChange={(e) => setNewComment(e.target.value)}
    placeholder="Ask a question..."
    className="w-full bg-transparent border border-white/10 rounded-lg p-3 text-white"
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
                {new Date(discussion.createdAt).toLocaleString()}
              </span>
            </div>

            <p className="text-sm text-white/60 mt-1">
              {discussion.content}
            </p>

            {/* REPLY BUTTON */}
            <button
              onClick={() =>
                setReplyTo(
                  replyTo === discussion._id ? null : discussion._id
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
                  className="w-full bg-transparent border border-white/10 rounded-lg p-2 text-sm text-white"
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
                  <div key={reply._id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-400" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white">
                          {reply.user?.name || "User"}
                        </span>
                        <span className="text-xs text-white/40">
                          {new Date(reply.createdAt).toLocaleString()}
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
