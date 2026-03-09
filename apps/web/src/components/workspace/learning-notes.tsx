"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, FileText, Trash2 } from "lucide-react";

interface Note {
  id: string;
  content: string;
  timestamp: Date;
}

export function LearningNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState("");

  useEffect(() => {
    // 从 localStorage 加载笔记
    const saved = localStorage.getItem("learning-notes");
    if (saved) {
      const parsed = JSON.parse(saved);
      setNotes(parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })));
    }
  }, []);

  const saveNote = () => {
    if (!currentNote.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      content: currentNote,
      timestamp: new Date(),
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem("learning-notes", JSON.stringify(updated));
    setCurrentNote("");
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    localStorage.setItem("learning-notes", JSON.stringify(updated));
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="h-4 w-4" />
          学习笔记
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="记录学习要点..."
          className="text-sm min-h-[80px]"
        />
        <Button onClick={saveNote} disabled={!currentNote.trim()} className="w-full" size="sm">
          <Save className="h-4 w-4 mr-2" />
          保存笔记
        </Button>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {notes.map((note) => (
            <div key={note.id} className="p-3 bg-amber-50 rounded-lg border border-amber-200 group">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs text-gray-500">
                  {note.timestamp.toLocaleString()}
                </span>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
