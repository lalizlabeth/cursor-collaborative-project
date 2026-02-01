"use client";

import { useState, useCallback } from "react";
import styles from "./StickersApp.module.css";

// Define the sticker data with colors and area numbers
interface StickerData {
  number: number;
  color: string;
  label: string;
}

const stickers: StickerData[] = [
  { number: 1, color: "#87CEEB", label: "Sky" },
  { number: 2, color: "#FFD700", label: "Sun" },
  { number: 3, color: "#DEB887", label: "House" },
  { number: 4, color: "#8B4513", label: "Roof" },
  { number: 5, color: "#654321", label: "Door" },
  { number: 6, color: "#ADD8E6", label: "Window L" },
  { number: 7, color: "#ADD8E6", label: "Window R" },
  { number: 8, color: "#8B4513", label: "Trunk" },
  { number: 9, color: "#228B22", label: "Leaves" },
  { number: 10, color: "#90EE90", label: "Grass" },
];

export function StickersApp() {
  const [selectedSticker, setSelectedSticker] = useState<number | null>(null);
  const [filledAreas, setFilledAreas] = useState<Record<number, boolean>>({});

  const handleStickerSelect = useCallback((stickerNumber: number) => {
    // If already placed, don't allow re-selection
    if (filledAreas[stickerNumber]) return;
    setSelectedSticker(stickerNumber);
  }, [filledAreas]);

  const handleAreaClick = useCallback((areaNumber: number) => {
    // Only fill if the selected sticker matches the area
    if (selectedSticker === areaNumber && !filledAreas[areaNumber]) {
      setFilledAreas((prev) => ({ ...prev, [areaNumber]: true }));
      setSelectedSticker(null);
    }
  }, [selectedSticker, filledAreas]);

  const handleReset = useCallback(() => {
    setFilledAreas({});
    setSelectedSticker(null);
  }, []);

  const filledCount = Object.values(filledAreas).filter(Boolean).length;
  const progress = Math.round((filledCount / stickers.length) * 100);
  const isComplete = filledCount === stickers.length;

  const getAreaFill = (areaNumber: number) => {
    if (filledAreas[areaNumber]) {
      return stickers.find((s) => s.number === areaNumber)?.color || "#fff";
    }
    return "#fff";
  };

  const getAreaClass = (areaNumber: number) => {
    if (filledAreas[areaNumber]) return styles.areaFilled;
    if (selectedSticker === areaNumber) return styles.areaHighlighted;
    return styles.area;
  };

  return (
    <div className={styles.stickersApp}>
      <div className={styles.canvasArea}>
        <svg viewBox="0 0 400 300" className={styles.canvas}>
          {/* Area 1: Sky */}
          <rect
            x="0"
            y="0"
            width="400"
            height="180"
            fill={getAreaFill(1)}
            className={getAreaClass(1)}
            onClick={() => handleAreaClick(1)}
          />
          {!filledAreas[1] && (
            <text x="200" y="40" className={styles.areaLabel}>1</text>
          )}

          {/* Area 10: Grass */}
          <rect
            x="0"
            y="180"
            width="400"
            height="120"
            fill={getAreaFill(10)}
            className={getAreaClass(10)}
            onClick={() => handleAreaClick(10)}
          />
          {!filledAreas[10] && (
            <text x="50" y="260" className={styles.areaLabel}>10</text>
          )}

          {/* Area 2: Sun */}
          <circle
            cx="340"
            cy="50"
            r="35"
            fill={getAreaFill(2)}
            className={getAreaClass(2)}
            onClick={() => handleAreaClick(2)}
          />
          {!filledAreas[2] && (
            <text x="340" y="55" className={styles.areaLabel}>2</text>
          )}

          {/* Area 3: House body */}
          <rect
            x="120"
            y="120"
            width="160"
            height="120"
            fill={getAreaFill(3)}
            className={getAreaClass(3)}
            onClick={() => handleAreaClick(3)}
          />
          {!filledAreas[3] && (
            <text x="200" y="200" className={styles.areaLabel}>3</text>
          )}

          {/* Area 4: Roof */}
          <polygon
            points="100,120 200,50 300,120"
            fill={getAreaFill(4)}
            className={getAreaClass(4)}
            onClick={() => handleAreaClick(4)}
          />
          {!filledAreas[4] && (
            <text x="200" y="100" className={styles.areaLabel}>4</text>
          )}

          {/* Area 5: Door */}
          <rect
            x="175"
            y="180"
            width="50"
            height="60"
            fill={getAreaFill(5)}
            className={getAreaClass(5)}
            onClick={() => handleAreaClick(5)}
          />
          {!filledAreas[5] && (
            <text x="200" y="215" className={styles.areaLabel}>5</text>
          )}

          {/* Area 6: Left Window */}
          <rect
            x="135"
            y="140"
            width="35"
            height="30"
            fill={getAreaFill(6)}
            className={getAreaClass(6)}
            onClick={() => handleAreaClick(6)}
          />
          {!filledAreas[6] && (
            <text x="152" y="160" className={styles.areaLabel}>6</text>
          )}

          {/* Area 7: Right Window */}
          <rect
            x="230"
            y="140"
            width="35"
            height="30"
            fill={getAreaFill(7)}
            className={getAreaClass(7)}
            onClick={() => handleAreaClick(7)}
          />
          {!filledAreas[7] && (
            <text x="247" y="160" className={styles.areaLabel}>7</text>
          )}

          {/* Area 8: Tree trunk */}
          <rect
            x="45"
            y="160"
            width="30"
            height="80"
            fill={getAreaFill(8)}
            className={getAreaClass(8)}
            onClick={() => handleAreaClick(8)}
          />
          {!filledAreas[8] && (
            <text x="60" y="210" className={styles.areaLabel}>8</text>
          )}

          {/* Area 9: Tree foliage */}
          <ellipse
            cx="60"
            cy="120"
            rx="50"
            ry="60"
            fill={getAreaFill(9)}
            className={getAreaClass(9)}
            onClick={() => handleAreaClick(9)}
          />
          {!filledAreas[9] && (
            <text x="60" y="125" className={styles.areaLabel}>9</text>
          )}

          {/* Outlines drawn on top */}
          <rect x="0" y="0" width="400" height="180" fill="none" stroke="#333" strokeWidth="1" />
          <rect x="0" y="180" width="400" height="120" fill="none" stroke="#333" strokeWidth="1" />
          <circle cx="340" cy="50" r="35" fill="none" stroke="#333" strokeWidth="1" />
          <rect x="120" y="120" width="160" height="120" fill="none" stroke="#333" strokeWidth="1" />
          <polygon points="100,120 200,50 300,120" fill="none" stroke="#333" strokeWidth="1" />
          <rect x="175" y="180" width="50" height="60" fill="none" stroke="#333" strokeWidth="1" />
          <rect x="135" y="140" width="35" height="30" fill="none" stroke="#333" strokeWidth="1" />
          <rect x="230" y="140" width="35" height="30" fill="none" stroke="#333" strokeWidth="1" />
          <rect x="45" y="160" width="30" height="80" fill="none" stroke="#333" strokeWidth="1" />
          <ellipse cx="60" cy="120" rx="50" ry="60" fill="none" stroke="#333" strokeWidth="1" />
        </svg>

        {isComplete && (
          <div className={styles.completeOverlay}>
            <div className={styles.completeMessage}>
              Complete!
            </div>
          </div>
        )}
      </div>

      <div className={styles.palette}>
        <div className={styles.paletteHeader}>
          <span className={styles.paletteTitle}>Stickers</span>
          <span className={styles.progress}>{progress}%</span>
        </div>

        <div className={styles.stickerGrid}>
          {stickers.map((sticker) => (
            <button
              key={sticker.number}
              className={`${styles.sticker} ${
                selectedSticker === sticker.number ? styles.stickerSelected : ""
              } ${filledAreas[sticker.number] ? styles.stickerUsed : ""}`}
              onClick={() => handleStickerSelect(sticker.number)}
              disabled={filledAreas[sticker.number]}
              title={sticker.label}
            >
              <span
                className={styles.stickerColor}
                style={{ backgroundColor: sticker.color }}
              />
              <span className={styles.stickerNumber}>{sticker.number}</span>
            </button>
          ))}
        </div>

        <div className={styles.instructions}>
          {selectedSticker ? (
            <p>Click area <strong>{selectedSticker}</strong> on the canvas</p>
          ) : (
            <p>Select a sticker, then click its matching area</p>
          )}
        </div>

        <button className={styles.resetButton} onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
