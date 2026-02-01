"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 18;
const INITIAL_SPEED = 150;

type Position = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const getInitialSnake = (): Position[] => [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

const getRandomFood = (snake: Position[]): Position => {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((segment) => segment.x === food.x && segment.y === food.y));
  return food;
};

export function SnakeApp() {
  const [snake, setSnake] = useState<Position[]>(getInitialSnake);
  const [food, setFood] = useState<Position>(() => getRandomFood(getInitialSnake()));
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const directionRef = useRef(direction);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const resetGame = useCallback(() => {
    const initialSnake = getInitialSnake();
    setSnake(initialSnake);
    setFood(getRandomFood(initialSnake));
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  }, []);

  const moveSnake = useCallback(() => {
    setSnake((currentSnake) => {
      const head = currentSnake[0];
      const currentDirection = directionRef.current;

      let newHead: Position;
      switch (currentDirection) {
        case "UP":
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case "DOWN":
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case "LEFT":
          newHead = { x: head.x - 1, y: head.y };
          break;
        case "RIGHT":
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      // Check self collision
      if (currentSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      const newSnake = [newHead, ...currentSnake];

      // Check if eating food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(getRandomFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, moveSnake]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying && !gameOver && e.key === " ") {
        resetGame();
        return;
      }

      if (gameOver && e.key === " ") {
        resetGame();
        return;
      }

      const currentDirection = directionRef.current;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (currentDirection !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (currentDirection !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (currentDirection !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (currentDirection !== "LEFT") setDirection("RIGHT");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameOver, resetGame]);

  // Focus container on mount
  useEffect(() => {
    gameContainerRef.current?.focus();
  }, []);

  const renderCell = (x: number, y: number) => {
    const isSnakeHead = snake[0].x === x && snake[0].y === y;
    const isSnakeBody = snake.slice(1).some((segment) => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;

    let backgroundColor = "rgba(0, 0, 0, 0.03)";
    let borderRadius = "2px";

    if (isSnakeHead) {
      backgroundColor = "var(--pastel-mint)";
      borderRadius = "4px";
    } else if (isSnakeBody) {
      backgroundColor = "var(--pastel-mint)";
    } else if (isFood) {
      backgroundColor = "var(--pastel-pink)";
      borderRadius = "50%";
    }

    return (
      <div
        key={`${x}-${y}`}
        style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          backgroundColor,
          borderRadius,
          border: isSnakeHead || isSnakeBody ? "1px solid rgba(0,0,0,0.15)" : "none",
          boxShadow: isFood ? "0 0 6px var(--pastel-pink)" : undefined,
          transition: "background-color 0.05s ease",
        }}
      />
    );
  };

  const grid = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      grid.push(renderCell(x, y));
    }
  }

  return (
    <div
      ref={gameContainerRef}
      tabIndex={0}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        height: "100%",
        padding: 8,
        outline: "none",
      }}
    >
      {/* Score display */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "8px 12px",
          background: "rgba(0, 0, 0, 0.03)",
          borderRadius: 8,
          fontFamily: "monospace",
          fontSize: 14,
        }}
      >
        <span>Score: {score}</span>
        <span style={{ color: "rgba(0,0,0,0.5)" }}>
          {isPlaying ? "Playing" : gameOver ? "Game Over" : "Press Start"}
        </span>
      </div>

      {/* Game grid */}
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gap: 1,
          padding: 8,
          background: "rgba(0, 0, 0, 0.02)",
          borderRadius: 8,
          border: "1px solid var(--window-border-dark)",
        }}
      >
        {grid}

        {/* Game over overlay */}
        {gameOver && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 255, 255, 0.9)",
              borderRadius: 8,
              gap: 12,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 600 }}>Game Over!</div>
            <div style={{ fontSize: 14, color: "rgba(0,0,0,0.6)" }}>
              Final Score: {score}
            </div>
            <button
              onClick={resetGame}
              style={{
                padding: "8px 16px",
                fontSize: 14,
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 6,
                background: "var(--pastel-mint)",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Play Again
            </button>
          </div>
        )}

        {/* Start overlay */}
        {!isPlaying && !gameOver && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 255, 255, 0.9)",
              borderRadius: 8,
              gap: 12,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 600 }}>Snake</div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(0,0,0,0.5)",
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              Use arrow keys or WASD to move
            </div>
            <button
              onClick={resetGame}
              style={{
                padding: "8px 16px",
                fontSize: 14,
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 6,
                background: "var(--pastel-mint)",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Start Game
            </button>
          </div>
        )}
      </div>

      {/* Controls hint */}
      <div
        style={{
          fontSize: 11,
          color: "rgba(0, 0, 0, 0.4)",
          textAlign: "center",
        }}
      >
        Arrow keys or WASD to move • Space to restart
      </div>
    </div>
  );
}
