import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useWindowManager, WindowConfig } from "../useWindowManager";

const STORAGE_KEY = "community-garden.window-state.v1";

const baseWindow: WindowConfig = {
  id: "apps",
  title: "Apps",
  icon: "pixelarticons:device-laptop",
};

const secondaryWindow: WindowConfig = {
  id: "notes",
  title: "Notes",
  icon: "pixelarticons:note",
};

beforeEach(() => {
  localStorage.clear();
});

describe("useWindowManager", () => {
  it("opens and focuses new windows", () => {
    const { result } = renderHook(() => useWindowManager([baseWindow]));

    act(() => {
      result.current.openWindow(secondaryWindow);
    });

    expect(result.current.windows).toHaveLength(2);
    expect(result.current.focusedWindowId).toBe("notes");
  });

  it("minimizes and restores windows", () => {
    const { result } = renderHook(() => useWindowManager([baseWindow]));

    act(() => {
      result.current.openWindow(secondaryWindow);
    });

    act(() => {
      result.current.minimizeWindow("notes");
    });

    const minimized = result.current.windows.find((w) => w.id === "notes");
    expect(minimized?.isMinimized).toBe(true);

    act(() => {
      result.current.restoreWindow("notes");
    });

    const restored = result.current.windows.find((w) => w.id === "notes");
    expect(restored?.isMinimized).toBe(false);
  });

  it("brings windows to front on focus", () => {
    const { result } = renderHook(() => useWindowManager([baseWindow]));

    act(() => {
      result.current.openWindow(secondaryWindow);
    });

    const before = result.current.windows.map((w) => ({ id: w.id, zIndex: w.zIndex }));

    act(() => {
      result.current.focusWindow("apps");
    });

    const after = result.current.windows.map((w) => ({ id: w.id, zIndex: w.zIndex }));
    const beforeApps = before.find((w) => w.id === "apps")?.zIndex ?? 0;
    const afterApps = after.find((w) => w.id === "apps")?.zIndex ?? 0;
    expect(afterApps).toBeGreaterThan(beforeApps);
  });

  it("persists window state to localStorage", async () => {
    const { result } = renderHook(() => useWindowManager([baseWindow]));

    act(() => {
      result.current.openWindow(secondaryWindow);
    });

    await waitFor(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toContain("notes");
    });
  });
});
