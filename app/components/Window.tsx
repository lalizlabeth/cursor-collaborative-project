"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import styles from "./Window.module.css";

export interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  color?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize?: { width: number; height: number };
  zIndex: number;
  isMaximized?: boolean;
  onMove: (position: { x: number; y: number }) => void;
  onResize: (size: { width: number; height: number }) => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize?: () => void;
  onFocus: () => void;
}

const DEFAULT_MIN_SIZE = { width: 200, height: 150 };

export function Window({
  id,
  title,
  children,
  color,
  position,
  size,
  minSize = DEFAULT_MIN_SIZE,
  zIndex,
  isMaximized = false,
  onMove,
  onResize,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ width: 0, height: 0, x: 0, y: 0 });

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile || isMaximized) return;
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      onFocus();
    },
    [position, onFocus, isMobile, isMaximized]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.current.x;
        const newY = e.clientY - dragStart.current.y;
        const maxX = Math.max(0, window.innerWidth - size.width);
        const maxY = Math.max(0, window.innerHeight - size.height);
        onMove({
          x: Math.min(maxX, Math.max(0, newX)),
          y: Math.min(maxY, Math.max(0, newY)),
        });
      }
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        const maxWidth = Math.max(minSize.width, window.innerWidth - position.x);
        const maxHeight = Math.max(minSize.height, window.innerHeight - position.y);
        const newWidth = Math.min(maxWidth, Math.max(minSize.width, resizeStart.current.width + deltaX));
        const newHeight = Math.min(maxHeight, Math.max(minSize.height, resizeStart.current.height + deltaY));
        onResize({ width: newWidth, height: newHeight });
      }
    },
    [isDragging, isResizing, onMove, onResize, minSize, position, size]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  // Handle resize
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile || isMaximized) return;
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      resizeStart.current = {
        width: size.width,
        height: size.height,
        x: e.clientX,
        y: e.clientY,
      };
      onFocus();
    },
    [size, onFocus, isMobile, isMaximized]
  );

  // Global mouse event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleWindowClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onFocus();
    },
    [onFocus]
  );

  const handleFocus = useCallback(() => {
    onFocus();
  }, [onFocus]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    },
    [onClose]
  );

  // Calculate styles based on mobile/maximized state
  const windowStyle: React.CSSProperties = isMobile
    ? {
      position: "relative",
      width: "100%",
      height: "auto",
      minHeight: "200px",
      zIndex,
    }
    : isMaximized
      ? {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex,
      }
      : {
        position: "absolute",
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      };

  return (
    <div
      ref={windowRef}
      className={`${styles.window} ${isMaximized ? styles.maximized : ""} ${isMobile ? styles.mobile : ""}`}
      style={windowStyle}
      onClick={handleWindowClick}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="dialog"
      aria-label={`${title} window`}
      data-testid={`window-${id}`}
    >
      <div
        className={styles.titleBar}
        onMouseDown={handleMouseDown}
        data-testid="window-title-bar"
      >
        <div className={styles.trafficLights}>
          <button
            className={`${styles.trafficLight} ${styles.close}`}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close window"
            data-testid="window-close-button"
          />
          <button
            className={`${styles.trafficLight} ${styles.minimize}`}
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            aria-label="Minimize window"
            data-testid="window-minimize-button"
          />
          <button
            className={`${styles.trafficLight} ${styles.maximize}`}
            onClick={(e) => {
              e.stopPropagation();
              onMaximize?.();
            }}
            aria-label="Maximize window"
            data-testid="window-maximize-button"
          />
        </div>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.content}>{children}</div>
      {!isMobile && !isMaximized && (
        <div
          className={styles.resizeHandle}
          onMouseDown={handleResizeMouseDown}
          data-testid="window-resize-handle"
        />
      )}
    </div>
  );
}
