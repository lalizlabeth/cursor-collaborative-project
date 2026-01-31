"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "@iconify/react";
import styles from "./NotesApp.module.css";

interface Note {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "noteos.notes.v1";

function createNewNote(): Note {
  return {
    id: Date.now().toString(),
    content: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function extractTitle(htmlContent: string): string {
  const plainText = htmlContent.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
  const firstLine = plainText.split("\n")[0].trim();
  return firstLine.substring(0, 50) || "Untitled note";
}

function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Load notes from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Note[];
        if (parsed.length > 0) {
          setNotes(parsed);
          setSelectedNoteId(parsed[0].id);
        } else {
          const defaultNote = createNewNote();
          setNotes([defaultNote]);
          setSelectedNoteId(defaultNote.id);
        }
      } catch {
        const defaultNote = createNewNote();
        setNotes([defaultNote]);
        setSelectedNoteId(defaultNote.id);
      }
    } else {
      const defaultNote = createNewNote();
      setNotes([defaultNote]);
      setSelectedNoteId(defaultNote.id);
    }
    setHasLoaded(true);
  }, []);

  // Save notes to localStorage (debounced)
  useEffect(() => {
    if (!hasLoaded) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [notes, hasLoaded]);

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  const handleNewNote = useCallback(() => {
    const newNote = createNewNote();
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    // Focus the editor after a brief delay
    setTimeout(() => {
      contentRef.current?.focus();
    }, 50);
  }, []);

  const handleSelectNote = useCallback((noteId: string) => {
    setSelectedNoteId(noteId);
    setTimeout(() => {
      contentRef.current?.focus();
    }, 50);
  }, []);

  const handleDeleteNote = useCallback(
    (noteId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setNotes((prev) => {
        const filtered = prev.filter((note) => note.id !== noteId);
        if (filtered.length === 0) {
          const defaultNote = createNewNote();
          setSelectedNoteId(defaultNote.id);
          return [defaultNote];
        }
        if (selectedNoteId === noteId) {
          setSelectedNoteId(filtered[0].id);
        }
        return filtered;
      });
    },
    [selectedNoteId]
  );

  const handleInput = useCallback(() => {
    if (!contentRef.current || !selectedNoteId) return;
    
    const content = contentRef.current.innerHTML;
    setNotes((prev) =>
      prev.map((note) =>
        note.id === selectedNoteId
          ? { ...note, content, updatedAt: Date.now() }
          : note
      )
    );
  }, [selectedNoteId]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const modKey = isMac ? e.metaKey : e.ctrlKey;

    if (modKey && e.key === "b") {
      e.preventDefault();
      document.execCommand("bold", false);
    } else if (modKey && e.key === "i") {
      e.preventDefault();
      document.execCommand("italic", false);
    } else if (modKey && e.key === "u") {
      e.preventDefault();
      document.execCommand("underline", false);
    }
  }, []);

  // Update content when selected note changes
  useEffect(() => {
    if (contentRef.current && selectedNote) {
      contentRef.current.innerHTML = selectedNote.content;
    }
  }, [selectedNoteId]); // Only run when selectedNoteId changes

  return (
    <div className={styles.notesApp}>
      <div className={styles.sidebar}>
        <button className={styles.newNoteButton} onClick={handleNewNote}>
          <Icon icon="pixelarticons:plus" width={14} height={14} />
          New note
        </button>
        <div className={styles.notesList}>
          {notes.map((note) => (
            <div
              key={note.id}
              className={`${styles.noteItem} ${
                note.id === selectedNoteId ? styles.selected : ""
              }`}
              onClick={() => handleSelectNote(note.id)}
            >
              <div className={styles.noteHeader}>
                <div className={styles.noteTitle}>{extractTitle(note.content)}</div>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => handleDeleteNote(note.id, e)}
                  aria-label="Delete note"
                >
                  <Icon icon="pixelarticons:close" width={12} height={12} />
                </button>
              </div>
              <div className={styles.noteTimestamp}>
                {getRelativeTime(note.updatedAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.contentArea}>
        <div
          ref={contentRef}
          className={styles.editor}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          data-placeholder="Start typing..."
          suppressContentEditableWarning
        />
      </div>
    </div>
  );
}
