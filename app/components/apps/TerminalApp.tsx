"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import styles from "./TerminalApp.module.css";

interface OutputLine {
  id: string;
  type: "command" | "response" | "error" | "ascii";
  content: string;
}

const ASCII_BANNER = `
 ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
 ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
    ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
    ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
    ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
    ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
                                                                   
              Welcome to Terminal v1.0
            Type 'help' for available commands
`;

const FILESYSTEM: Record<string, string[]> = {
  "~": ["Documents", "Downloads", "Pictures", "notes.txt", ".config"],
  "~/Documents": ["project.md", "todo.txt", "readme.md"],
  "~/Downloads": ["image.png", "archive.zip"],
  "~/Pictures": ["photo1.jpg", "photo2.jpg", "wallpaper.png"],
};

const FILE_CONTENTS: Record<string, string> = {
  "notes.txt": "Remember to water the plants!\nBuy groceries\nFinish the terminal app",
  "project.md": "# My Project\n\nThis is a sample project file.",
  "todo.txt": "[ ] Learn more about CRT monitors\n[x] Build terminal app\n[ ] Add more features",
  "readme.md": "# NoteOS\n\nA retro-styled operating system interface.",
};

const HELP_TEXT = `
Available commands:
  help          Show this help message
  clear         Clear the terminal screen
  echo [text]   Print text to the terminal
  date          Show current date and time
  whoami        Display current user
  pwd           Print working directory
  ls            List directory contents
  cd [dir]      Change directory
  cat [file]    Display file contents
  neofetch      Display system information
  matrix        Display matrix effect (just kidding)
  exit          Close terminal (not really)

Keyboard shortcuts:
  Up/Down       Navigate command history
  Ctrl+L        Clear screen
  Ctrl+C        Cancel current input
`;

const NEOFETCH = `
        ████████████████        user@noteos
      ██░░░░░░░░░░░░░░░░██      -------------
    ██░░████████████████░░██    OS: NoteOS 1.0
    ██░░██            ██░░██    Host: Browser Runtime
    ██░░██   ██████   ██░░██    Kernel: JavaScript ES2024
    ██░░██   ██  ██   ██░░██    Uptime: since you opened this
    ██░░██   ██████   ██░░██    Shell: noteos-sh
    ██░░██            ██░░██    Terminal: CRT Emulator
    ██░░████████████████░░██    CPU: Your Device
      ██░░░░░░░░░░░░░░░░██      Memory: Plenty
        ████████████████        
`;

export function TerminalApp() {
  const [output, setOutput] = useState<OutputLine[]>(() => [
    {
      id: "welcome-banner",
      type: "ascii",
      content: ASCII_BANNER,
    },
  ]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDir, setCurrentDir] = useState("~");

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addLine = useCallback((type: OutputLine["type"], content: string) => {
    const newLine: OutputLine = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type,
      content,
    };
    setOutput((prev) => [...prev, newLine]);
  }, []);

  const clearScreen = useCallback(() => {
    setOutput([]);
  }, []);

  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmedCmd = cmd.trim();
      if (!trimmedCmd) return;

      // Add command to output
      addLine("command", `${currentDir} $ ${trimmedCmd}`);

      // Add to history
      setCommandHistory((prev) => [...prev, trimmedCmd]);
      setHistoryIndex(-1);

      // Parse command
      const parts = trimmedCmd.split(/\s+/);
      const command = parts[0].toLowerCase();
      const args = parts.slice(1);

      switch (command) {
        case "help":
          addLine("response", HELP_TEXT);
          break;

        case "clear":
          clearScreen();
          break;

        case "echo":
          addLine("response", args.join(" ") || "");
          break;

        case "date":
          addLine("response", new Date().toString());
          break;

        case "whoami":
          addLine("response", "user");
          break;

        case "pwd":
          addLine("response", currentDir.replace("~", "/home/user"));
          break;

        case "ls": {
          const targetDir = args[0] ? `${currentDir}/${args[0]}`.replace("//", "/") : currentDir;
          const files = FILESYSTEM[targetDir] || FILESYSTEM[currentDir];
          if (files) {
            addLine("response", files.join("  "));
          } else {
            addLine("error", `ls: cannot access '${args[0]}': No such file or directory`);
          }
          break;
        }

        case "cd": {
          const target = args[0];
          if (!target || target === "~") {
            setCurrentDir("~");
          } else if (target === "..") {
            const parts = currentDir.split("/");
            if (parts.length > 1) {
              parts.pop();
              setCurrentDir(parts.join("/") || "~");
            }
          } else {
            const newDir = target.startsWith("~") ? target : `${currentDir}/${target}`;
            if (FILESYSTEM[newDir]) {
              setCurrentDir(newDir);
            } else {
              addLine("error", `cd: no such file or directory: ${target}`);
            }
          }
          break;
        }

        case "cat": {
          const filename = args[0];
          if (!filename) {
            addLine("error", "cat: missing file operand");
          } else if (FILE_CONTENTS[filename]) {
            addLine("response", FILE_CONTENTS[filename]);
          } else {
            addLine("error", `cat: ${filename}: No such file or directory`);
          }
          break;
        }

        case "neofetch":
          addLine("ascii", NEOFETCH);
          break;

        case "matrix":
          addLine("response", "Nice try! The matrix effect would crash your browser. 😄");
          break;

        case "exit":
          addLine("response", "Nice try! You can't escape NoteOS that easily.");
          break;

        case "sudo":
          addLine("error", "user is not in the sudoers file. This incident will be reported.");
          break;

        case "rm":
          if (args.includes("-rf") && args.includes("/")) {
            addLine("error", "Nice try! This terminal is protected against catastrophic commands.");
          } else {
            addLine("error", "rm: operation not permitted in demo mode");
          }
          break;

        default:
          addLine("error", `command not found: ${command}`);
          break;
      }
    },
    [addLine, clearScreen, currentDir]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        executeCommand(input);
        setInput("");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1);
            setInput("");
          } else {
            setHistoryIndex(newIndex);
            setInput(commandHistory[newIndex]);
          }
        }
      } else if (e.ctrlKey && e.key === "l") {
        e.preventDefault();
        clearScreen();
      } else if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        addLine("command", `${currentDir} $ ${input}^C`);
        setInput("");
      }
    },
    [input, executeCommand, commandHistory, historyIndex, clearScreen, addLine, currentDir]
  );

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input on click
  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={`${styles.terminal} ${styles.powerOn}`} onClick={handleContainerClick}>
      <div className={styles.crtBezel} />
      <div className={styles.crtScreen}>
        <div className={styles.scanlines} />
        <div className={styles.vignette} />
        <div className={styles.screenGlow} />

        <div ref={outputRef} className={styles.output}>
          {output.map((line) => (
            <div
              key={line.id}
              className={`${styles.line} ${styles[line.type]}`}
            >
              {line.content}
            </div>
          ))}
        </div>

        <div className={styles.inputArea}>
          <span className={styles.promptSymbol}>{currentDir} $</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
          />
        </div>
      </div>
    </div>
  );
}
