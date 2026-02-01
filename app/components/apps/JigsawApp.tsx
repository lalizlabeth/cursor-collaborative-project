"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import styles from "./JigsawApp.module.css";

const COLS = 5;
const ROWS = 4;
const PIECE_COUNT = COLS * ROWS;
const PUZZLE_WIDTH = 500;
const PUZZLE_HEIGHT = 320;
const PIECE_WIDTH = PUZZLE_WIDTH / COLS;
const PIECE_HEIGHT = PUZZLE_HEIGHT / ROWS;
const SNAP_THRESHOLD = 20;

interface Piece {
  id: number;
  correctX: number;
  correctY: number;
  currentX: number;
  currentY: number;
  isPlaced: boolean;
  col: number;
  row: number;
}

function generatePieces(randomize: boolean): Piece[] {
  const pieces: Piece[] = [];
  
  // Create shuffled positions for the tray area
  const trayPositions: { x: number; y: number }[] = [];
  for (let trayRow = 0; trayRow < 2; trayRow++) {
    for (let trayCol = 0; trayCol < COLS * 2; trayCol++) {
      trayPositions.push({
        x: trayCol * PIECE_WIDTH - PIECE_WIDTH * 2,
        y: PUZZLE_HEIGHT + 20 + trayRow * PIECE_HEIGHT,
      });
    }
  }
  // Shuffle the positions
  for (let i = trayPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [trayPositions[i], trayPositions[j]] = [trayPositions[j], trayPositions[i]];
  }
  
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const id = row * COLS + col;
      const correctX = col * PIECE_WIDTH;
      const correctY = row * PIECE_HEIGHT;
      
      let currentX = correctX;
      let currentY = correctY;
      
      if (randomize) {
        // Use shuffled tray position
        const pos = trayPositions[id % trayPositions.length];
        currentX = pos.x;
        currentY = pos.y;
      }
      
      pieces.push({
        id,
        correctX,
        correctY,
        currentX,
        currentY,
        isPlaced: !randomize,
        col,
        row,
      });
    }
  }
  
  return pieces;
}

export function JigsawApp() {
  const [pieces, setPieces] = useState<Piece[]>(() => generatePieces(true));
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragStart, setDragStart] = useState({ mouseX: 0, mouseY: 0, pieceX: 0, pieceY: 0 });
  const [completed, setCompleted] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const checkCompletion = useCallback((updatedPieces: Piece[]) => {
    const allPlaced = updatedPieces.every((p) => p.isPlaced);
    if (allPlaced && !completed) {
      setCompleted(true);
      // Trigger confetti celebration
      const duration = 3000;
      const end = Date.now() + duration;
      
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ["#ff6b6b", "#4ecdc4", "#ffe66d", "#95e1d3", "#f38181"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ["#ff6b6b", "#4ecdc4", "#ffe66d", "#95e1d3", "#f38181"],
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [completed]);

  const handleMouseDown = (e: React.MouseEvent, pieceId: number) => {
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece || piece.isPlaced) return;
    
    e.preventDefault();
    
    // Store the initial mouse position and piece position
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      pieceX: piece.currentX,
      pieceY: piece.currentY,
    });
    setDraggingId(pieceId);
    
    // Bring piece to front
    setPieces((prev) => {
      const updated = prev.filter((p) => p.id !== pieceId);
      const dragged = prev.find((p) => p.id === pieceId)!;
      return [...updated, dragged];
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (draggingId === null) return;
      
      // Calculate movement delta from start position
      const deltaX = e.clientX - dragStart.mouseX;
      const deltaY = e.clientY - dragStart.mouseY;
      
      // Apply delta to original piece position
      const newX = dragStart.pieceX + deltaX;
      const newY = dragStart.pieceY + deltaY;
      
      setPieces((prev) =>
        prev.map((p) =>
          p.id === draggingId ? { ...p, currentX: newX, currentY: newY } : p
        )
      );
    },
    [draggingId, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    if (draggingId === null) return;
    
    setPieces((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== draggingId) return p;
        
        // Check if piece is close to its correct position
        const distX = Math.abs(p.currentX - p.correctX);
        const distY = Math.abs(p.currentY - p.correctY);
        
        if (distX < SNAP_THRESHOLD && distY < SNAP_THRESHOLD) {
          return {
            ...p,
            currentX: p.correctX,
            currentY: p.correctY,
            isPlaced: true,
          };
        }
        
        // Snap to nearest piece-sized grid position
        const snappedX = Math.round(p.currentX / PIECE_WIDTH) * PIECE_WIDTH;
        const snappedY = Math.round(p.currentY / PIECE_HEIGHT) * PIECE_HEIGHT;
        
        return {
          ...p,
          currentX: snappedX,
          currentY: snappedY,
        };
      });
      
      // Check completion after state update
      setTimeout(() => checkCompletion(updated), 0);
      
      return updated;
    });
    
    setDraggingId(null);
  }, [draggingId, checkCompletion]);

  useEffect(() => {
    if (draggingId !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [draggingId, handleMouseMove, handleMouseUp]);

  const handleStartAgain = () => {
    setPieces(generatePieces(true));
    setCompleted(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.gameArea}>
        <div className={styles.puzzleBoard} ref={boardRef}>
          {/* Ghost grid showing where pieces should go */}
          <div className={styles.ghostGrid}>
            {Array.from({ length: PIECE_COUNT }).map((_, i) => (
              <div key={i} className={styles.ghostCell} />
            ))}
          </div>
          
          {/* Puzzle pieces */}
          {pieces.map((piece) => (
            <div
              key={piece.id}
              className={`${styles.piece} ${piece.isPlaced ? styles.placed : ""} ${
                draggingId === piece.id ? styles.dragging : ""
              }`}
              style={{
                width: PIECE_WIDTH,
                height: PIECE_HEIGHT,
                left: piece.currentX,
                top: piece.currentY,
                backgroundImage: "url(/world-map.png)",
                backgroundSize: `${PUZZLE_WIDTH}px ${PUZZLE_HEIGHT}px`,
                backgroundPosition: `-${piece.col * PIECE_WIDTH}px -${piece.row * PIECE_HEIGHT}px`,
                zIndex: piece.isPlaced ? 1 : draggingId === piece.id ? 100 : 10,
              }}
              onMouseDown={(e) => handleMouseDown(e, piece.id)}
            />
          ))}
        </div>
        
        {completed && (
          <div className={styles.completedMessage}>
            <span>🎉</span> Puzzle Complete! <span>🎉</span>
          </div>
        )}
      </div>
      
      <div className={styles.controls}>
        <button className={styles.button} onClick={handleStartAgain}>
          Start Again
        </button>
      </div>
    </div>
  );
}
