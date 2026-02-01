"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "@iconify/react";
import styles from "./TodosApp.module.css";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  color: string;
}

const STORAGE_KEY = "community-garden.todos.v1";

const CONFETTI_COLORS = [
  "var(--pastel-pink)",
  "var(--pastel-mint)",
  "var(--pastel-yellow)",
  "var(--pastel-blue)",
  "var(--pastel-lavender)",
  "var(--pastel-peach)",
];

function generateConfetti(): ConfettiPiece[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  }));
}

export function TodosApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Load todos from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Todo[];
        setTodos(parsed);
      } catch {
        setTodos([]);
      }
    }
    setHasLoaded(true);
  }, []);

  // Save todos to localStorage (debounced)
  useEffect(() => {
    if (!hasLoaded) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }, 300);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [todos, hasLoaded]);

  const handleAddTodo = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
    };

    setTodos((prev) => [newTodo, ...prev]);
    setInputValue("");
    inputRef.current?.focus();
  }, [inputValue]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddTodo();
      }
    },
    [handleAddTodo]
  );

  const handleToggleTodo = useCallback((id: string) => {
    setTodos((prev) => {
      const todo = prev.find((t) => t.id === id);
      // Trigger confetti only when completing (not uncompleting)
      if (todo && !todo.completed) {
        setConfettiPieces(generateConfetti());
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1000);
      }
      return prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
    });
  }, []);

  const handleDeleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className={styles.todosApp}>
      {showConfetti && (
        <div className={styles.confettiContainer}>
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className={styles.confetti}
              style={{
                left: `${piece.left}%`,
                animationDelay: `${piece.delay}s`,
                backgroundColor: piece.color,
              }}
            />
          ))}
        </div>
      )}
      <div className={styles.inputArea}>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder="Add a new task..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className={styles.addButton}
          onClick={handleAddTodo}
          disabled={!inputValue.trim()}
        >
          <Icon icon="pixelarticons:plus" width={16} height={16} />
          Add
        </button>
      </div>

      {totalCount > 0 && (
        <div className={styles.stats}>
          {completedCount} of {totalCount} completed
        </div>
      )}

      <div className={styles.todoList}>
        {todos.length === 0 ? (
          <div className={styles.emptyState}>
            <Icon
              icon="pixelarticons:checkbox-on"
              width={32}
              height={32}
              style={{ opacity: 0.4 }}
            />
            <p>No tasks yet</p>
            <p className={styles.emptyHint}>Add a task to get started</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`${styles.todoItem} ${
                todo.completed ? styles.completed : ""
              }`}
            >
              <button
                className={styles.checkbox}
                onClick={() => handleToggleTodo(todo.id)}
                aria-label={
                  todo.completed ? "Mark as incomplete" : "Mark as complete"
                }
              >
                <span className={styles.checkboxIcon}>
                  {todo.completed && (
                    <Icon icon="pixelarticons:check" width={12} height={12} />
                  )}
                </span>
              </button>
              <span className={styles.todoText}>{todo.text}</span>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteTodo(todo.id)}
                aria-label="Delete task"
              >
                <Icon icon="pixelarticons:trash" width={14} height={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
