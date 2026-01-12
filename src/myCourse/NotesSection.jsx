import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import RichTextEditor from "./RichTextEditor";
import {
  createNote,
  getNotesByCourse,
  updateNote,
  deleteNote,
} from "@/api/notes.api";

const NotesSection = ({ courseId }) => {
  const [notes, setNotes] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  /* ===== FETCH NOTES ===== */
  useEffect(() => {
    if (!courseId) return;

    getNotesByCourse(courseId)
      .then((res) => setNotes(res.data.data))
      .catch(console.error);
  }, [courseId]);

  /* ===== OPEN NEW NOTE ===== */
  const openNewNote = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setIsEditorOpen(true);
  };

  /* ===== SAVE NOTE ===== */
const handleSave = async () => {
  const isEmptyContent =
    !content ||
    content === "<p></p>" ||
    content === "<p><br></p>";

  if (!title.trim() || isEmptyContent) {
    alert("Title and content are required");
    return;
  }

  if (editingId) {
    const res = await updateNote(editingId, { title, content });
    setNotes(prev =>
      prev.map(n => (n._id === editingId ? res.data.data : n))
    );
  } else {
    const res = await createNote({
      title,
      content,
      course: courseId,
    });
    setNotes(prev => [res.data.data, ...prev]);
  }

  setIsEditorOpen(false);
  setEditingId(null);
  setTitle("");
  setContent("");
};



  /* ===== EDIT NOTE ===== */
  const handleEdit = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setIsEditorOpen(true);
  };

  /* ===== DELETE NOTE ===== */
  const handleDelete = async (id) => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-purple-500">
          Notes
        </h3>

        {!isEditorOpen && (
          <Button
            className="bg-purple-600 hover:bg-purple-700 gap-2"
            onClick={openNewNote}
          >
            <Plus className="w-4 h-4" />
            NEW NOTE
          </Button>
        )}
      </div>

      {/* EDITOR */}
      {isEditorOpen && (
        <RichTextEditor
          title={title}
          content={content}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onSave={handleSave}
          onCancel={() => setIsEditorOpen(false)}
        />
      )}

      {/* NOTES LIST */}
     <div className="space-y-5">
  {notes.map((note) => (
    <div
      key={note._id}
      className="rounded-xl border border-white/10 p-5"
    >
      <div className="flex items-center justify-between">
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

      {/* ✅ CORRECT HTML RENDERING */}
      <div
        className="prose prose-invert max-w-none mt-2"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
    </div>
  ))}
</div>

    </div>
  );
};

export default NotesSection;
