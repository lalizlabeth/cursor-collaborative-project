"use client";

import { useState, useCallback, useEffect } from "react";

type MenuActionItem = {
  label: string;
  action?: () => void;
  divider?: false | undefined;
};

type MenuDividerItem = {
  divider: true;
  label?: never;
  action?: never;
};

export interface MenuItem {
  label: string;
  items?: Array<MenuActionItem | MenuDividerItem>;
}

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize: { width: number; height: number };
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  color?: string;
  menuItems?: MenuItem[];
}

export interface WindowConfig {
  id: string;
  title: string;
  icon: string;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  color?: string;
  menuItems?: MenuItem[];
}

interface UseWindowManagerReturn {
  windows: WindowState[];
  focusedWindowId: string | null;
  openWindow: (config: WindowConfig) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  clearFocus: () => void;
  moveWindow: (id: string, position: { x: number; y: number }) => void;
  resizeWindow: (id: string, size: { width: number; height: number }) => void;
  getWindow: (id: string) => WindowState | undefined;
  getFocusedWindow: () => WindowState | undefined;
}

const DEFAULT_SIZE = { width: 400, height: 300 };
const DEFAULT_MIN_SIZE = { width: 200, height: 150 };
const WINDOW_STATE_STORAGE_KEY = "community-garden.window-state.v1";

type PersistedWindowState = Pick<
  WindowState,
  "id" | "title" | "icon" | "position" | "size" | "minSize" | "zIndex" | "isMinimized" | "isMaximized" | "color"
>;

const getMaxZIndex = (list: WindowState[]) => (list.length > 0 ? Math.max(...list.map((w) => w.zIndex)) : 0);

const getPersistedWindows = (): PersistedWindowState[] | undefined => {
  if (typeof window === "undefined") return undefined;
  try {
    const stored = localStorage.getItem(WINDOW_STATE_STORAGE_KEY);
    if (!stored) return undefined;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return undefined;
    return parsed as PersistedWindowState[];
  } catch {
    return undefined;
  }
};

export function useWindowManager(
  initialWindows: WindowConfig[] = []
): UseWindowManagerReturn {
  const [windows, setWindows] = useState<WindowState[]>(() => {
    return initialWindows.map((config, index) => ({
      id: config.id,
      title: config.title,
      icon: config.icon,
      position: config.defaultPosition ?? { x: 50 + index * 30, y: 50 + index * 30 },
      size: config.defaultSize ?? DEFAULT_SIZE,
      minSize: config.minSize ?? DEFAULT_MIN_SIZE,
      zIndex: index + 1,
      isMinimized: false,
      isMaximized: false,
      color: config.color,
      menuItems: config.menuItems,
    }));
  });

  // Track the currently focused window
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(
    initialWindows.length > 0 ? initialWindows[initialWindows.length - 1].id : null
  );
  const [hasLoadedPersisted, setHasLoadedPersisted] = useState(false);

  useEffect(() => {
    const persisted = getPersistedWindows();
    if (persisted) {
      const restored = persisted.map((config, index) => ({
        id: config.id,
        title: config.title,
        icon: config.icon,
        position: config.position ?? { x: 50 + index * 30, y: 50 + index * 30 },
        size: config.size ?? DEFAULT_SIZE,
        minSize: config.minSize ?? DEFAULT_MIN_SIZE,
        zIndex: config.zIndex ?? index + 1,
        isMinimized: config.isMinimized ?? false,
        isMaximized: config.isMaximized ?? false,
        color: config.color,
      }));
      setWindows(restored);
      const visible = restored.filter((w) => !w.isMinimized);
      if (visible.length > 0) {
        const topWindow = visible.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
        setFocusedWindowId(topWindow.id);
      } else {
        setFocusedWindowId(null);
      }
    }
    setHasLoadedPersisted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasLoadedPersisted) return;
    try {
      const payload: PersistedWindowState[] = windows.map((w) => ({
        id: w.id,
        title: w.title,
        icon: w.icon,
        position: w.position,
        size: w.size,
        minSize: w.minSize,
        zIndex: w.zIndex,
        isMinimized: w.isMinimized,
        isMaximized: w.isMaximized,
        color: w.color,
      }));
      localStorage.setItem(WINDOW_STATE_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage errors.
    }
  }, [windows, hasLoadedPersisted]);

  const openWindow = useCallback((config: WindowConfig) => {
    setFocusedWindowId(config.id);
    setWindows((prev) => {
      const exists = prev.find((w) => w.id === config.id);
      if (exists) {
        const maxZ = getMaxZIndex(prev);
        // Update window with latest config (icon, title, color) and restore if minimized
        return prev.map((w) =>
          w.id === config.id
            ? {
                ...w,
                icon: config.icon,
                title: config.title,
                color: config.color,
                isMinimized: false,
                zIndex: maxZ + 1,
              }
            : w
        );
      }
      const maxZ = getMaxZIndex(prev);
      return [
        ...prev,
        {
          id: config.id,
          title: config.title,
          icon: config.icon,
          position: config.defaultPosition ?? { x: 50 + prev.length * 30, y: 50 + prev.length * 30 },
          size: config.defaultSize ?? DEFAULT_SIZE,
          minSize: config.minSize ?? DEFAULT_MIN_SIZE,
          zIndex: maxZ + 1,
          isMinimized: false,
          isMaximized: false,
          color: config.color,
          menuItems: config.menuItems,
        },
      ];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const remaining = prev.filter((w) => w.id !== id);
      // Focus the topmost visible window after closing
      if (remaining.length > 0) {
        const visibleWindows = remaining.filter((w) => !w.isMinimized);
        if (visibleWindows.length > 0) {
          const topWindow = visibleWindows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
          setFocusedWindowId(topWindow.id);
        } else {
          setFocusedWindowId(null);
        }
      } else {
        setFocusedWindowId(null);
      }
      return remaining;
    });
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const updated = prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w));
      // Focus the next topmost visible window
      const visibleWindows = updated.filter((w) => !w.isMinimized);
      if (visibleWindows.length > 0) {
        const topWindow = visibleWindows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
        setFocusedWindowId(topWindow.id);
      } else {
        setFocusedWindowId(null);
      }
      return updated;
    });
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      )
    );
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setFocusedWindowId(id);
    setWindows((prev) => {
      const maxZ = getMaxZIndex(prev);
      return prev.map((w) =>
        w.id === id
          ? { ...w, isMinimized: false, zIndex: maxZ + 1 }
          : w
      );
    });
  }, []);

  const focusWindow = useCallback((id: string) => {
    setFocusedWindowId(id);
    setWindows((prev) => {
      const maxZ = getMaxZIndex(prev);
      const targetWindow = prev.find((w) => w.id === id);
      if (!targetWindow || targetWindow.zIndex === maxZ) return prev;
      return prev.map((w) =>
        w.id === id ? { ...w, zIndex: maxZ + 1 } : w
      );
    });
  }, []);

  const clearFocus = useCallback(() => {
    setFocusedWindowId(null);
  }, []);

  const moveWindow = useCallback(
    (id: string, position: { x: number; y: number }) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, position } : w))
      );
    },
    []
  );

  const resizeWindow = useCallback(
    (id: string, size: { width: number; height: number }) => {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== id) return w;
          return {
            ...w,
            size: {
              width: Math.max(size.width, w.minSize.width),
              height: Math.max(size.height, w.minSize.height),
            },
          };
        })
      );
    },
    []
  );

  const getWindow = useCallback(
    (id: string) => windows.find((w) => w.id === id),
    [windows]
  );

  const getFocusedWindow = useCallback(
    () => (focusedWindowId ? windows.find((w) => w.id === focusedWindowId) : undefined),
    [windows, focusedWindowId]
  );

  return {
    windows,
    focusedWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    clearFocus,
    moveWindow,
    resizeWindow,
    getWindow,
    getFocusedWindow,
  };
}
