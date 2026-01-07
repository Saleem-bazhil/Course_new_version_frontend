import { useState } from "react";
import { Plus, MessageCircle, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "./RichTextEditor";
import { cn } from "@/lib/utils";

const mockNotes = [
  {
    id: "1",
    title: "Key concepts in Find Bridges",
    content:
      "Bridges in a graph are edges whose removal disconnects the graph...",
    timestamp: "2 hours ago",
    lessonTitle: "Find Bridges",
  },
  {
    id: "2",
    title: "Articulation Points Algorithm",
    content:
      "DFS-based algorithm to find cut vertices in O(V+E) time...",
    timestamp: "Yesterday",
    lessonTitle: "Articulation Points",
  },
];

const mockDiscussions = [
  {
    id: "1",
    author: "Alex Chen",
    content:
      "Can someone explain the difference between bridges and articulation points?",
    timestamp: "3 hours ago",
    replies: 5,
  },
  {
    id: "2",
    author: "Sarah Miller",
    content:
      "I'm having trouble understanding the low-link values in Tarjan's algorithm...",
    timestamp: "1 day ago",
    replies: 12,
  },
];

const NotesDiscussions = () => {
  const [activeTab, setActiveTab] = useState("notes");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [notes, setNotes] = useState(mockNotes);

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
        {/* Tabs */}
        <TabsList className="bg-transparent border-b border-white/10 rounded-none w-full justify-start h-auto p-0 gap-8">
          <TabsTrigger
            value="notes"
            className={cn( 
              "rounded-none border-b-2 border-border pb-3 px-0 font-medium transition-all",
              "data-[state=active]:border-purple-500 data-[state=active]:text-purple-500",
              "data-[state=inactive]:text-white/50 hover:text-white"
            )}
          >
            Notes
          </TabsTrigger>

          <TabsTrigger
            value="discussions"
            className={cn(
              " rounded-none border-b-2 border-transparent pb-3 px-0 font-medium transition-all",
              "data-[state=active]:border-purple-500 data-[state=active]:text-purple-500",
              "data-[state=inactive]:text-white/50 hover:text-white"
            )}
          >
            Discussions
          </TabsTrigger>
        </TabsList>

        {/* NOTES TAB */}
        <TabsContent value="notes" className="mt-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-purple-500">
              Notes
            </h3>

            {!isEditorOpen && (
              <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
                <Plus className="w-4 h-4" />
                NEW NOTE
              </Button>
            )}
          </div>

          {/* Editor */}
          {isEditorOpen && (
            <div className="mb-8 animate-fade-in">
              <RichTextEditor
                title={noteTitle}
                content={noteContent}
                onTitleChange={setNoteTitle}
                onContentChange={setNoteContent}
                onSave={handleSaveNote}
                onCancel={handleCancel}
              />
            </div>
          )}

          {/* Notes List */}
          <div className="space-y-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="
                  rounded-xl
                  bg-gradient-to-br from-white/[0.04] to-white/[0.01]
                  border border-white/10
                  p-5
                  transition-all
                  hover:border-purple-500/40
                  hover:bg-white/[0.06]
                  cursor-pointer
                "
              >
                <h4 className="text-base font-semibold text-white mb-1">
                  {note.title}
                </h4>

                <p className="text-sm text-white/60 leading-relaxed line-clamp-2">
                  {note.content}
                </p>

                <div className="flex items-center gap-4 mt-4 text-xs text-white/40">
                  <span>{note.lessonTitle}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {note.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* DISCUSSIONS TAB */}
        <TabsContent value="discussions" className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-purple-500">
              Discussions
            </h3>
            <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
              <Plus className="w-4 h-4" />
              ASK A QUESTION
            </Button>
          </div>

          <div className="space-y-6">
            {mockDiscussions.map((discussion) => (
              <div
                key={discussion.id}
                className="
                  rounded-xl
                  bg-gradient-to-br from-white/[0.04] to-white/[0.01]
                  border border-white/10
                  p-5
                  transition-all
                  hover:border-purple-500/40
                "
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">
                        {discussion.author}
                      </span>
                      <span className="text-xs text-white/40">
                        {discussion.timestamp}
                      </span>
                    </div>

                    <p className="text-sm text-white/60 mt-1">
                      {discussion.content}
                    </p>

                    <div className="flex items-center gap-2 mt-3 text-xs text-purple-400">
                      <MessageCircle className="w-4 h-4" />
                      <span>{discussion.replies} replies</span>
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
